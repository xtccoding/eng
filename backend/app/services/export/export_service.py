from typing import List
import json
import os
from datetime import datetime


class DateTimeEncoder(json.JSONEncoder):
    """自定义JSON编码器，处理datetime对象"""
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

from app.models.typing import TypingSession, TypingResult
from app.models.content import Content, Article
from app.models.progress import UserProgress, Achievement, WordProgress
from app.models.export import ExportRecord
from app.schemas.export import (
    ExportRequest,
    ExportResponse,
    ImportResponse,
    ExportRecordResponse,
)
from app.core.config import settings


class ExportService:
    """导出导入服务"""

    async def export_data(self, export_data: ExportRequest) -> ExportResponse:
        """导出数据"""
        # 根据导出类型获取数据
        if export_data.export_type == "full":
            data = await self._export_full(export_data.include_presets)
        elif export_data.export_type == "progress":
            data = await self._export_progress()
        elif export_data.export_type == "content":
            data = await self._export_content(export_data.include_presets)
        else:
            raise ValueError(f"不支持的导出类型：{export_data.export_type}")
        
        # 生成文件名
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_name = f"export_{export_data.export_type}_{timestamp}.json"
        file_path = os.path.join(settings.EXPORT_DIR, file_name)
        
        # 写入文件
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2, cls=DateTimeEncoder)
        
        # 获取文件大小
        file_size = os.path.getsize(file_path)
        
        # 记录导出
        await ExportRecord.create(
            export_type=export_data.export_type,
            file_name=file_name,
            file_path=file_path,
            file_size=file_size,
            record_count=data.get("record_count", 0),
            status="completed",
        )
        
        return ExportResponse(
            file_name=file_name,
            file_path=file_path,
            file_size=file_size,
            record_count=data.get("record_count", 0),
            export_type=export_data.export_type,
            created_at=datetime.now(),
        )

    async def import_data(self, file_path: str) -> ImportResponse:
        """导入数据"""
        try:
            # 读取文件
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            # 根据数据类型导入
            import_type = data.get("type", "unknown")
            
            if import_type == "full":
                result = await self._import_full(data)
            elif import_type == "progress":
                result = await self._import_progress(data)
            elif import_type == "content":
                result = await self._import_content(data)
            else:
                raise ValueError(f"不支持的导入类型：{import_type}")
            
            return ImportResponse(
                success=True,
                message="导入成功",
                imported_records=result["imported"],
                skipped_records=result["skipped"],
                errors=result.get("errors", []),
            )
        except Exception as e:
            return ImportResponse(
                success=False,
                message=f"导入失败：{str(e)}",
                imported_records=0,
                skipped_records=0,
                errors=[str(e)],
            )

    async def get_export_records(self) -> List[ExportRecordResponse]:
        """获取导出记录"""
        records = await ExportRecord.all().order_by("-created_at")
        return [ExportRecordResponse.from_orm(r) for r in records]

    async def create_backup(self) -> str:
        """创建备份"""
        # 创建完整备份
        export_data = ExportRequest(
            export_type="full",
            include_presets=True,
            format="json",
        )
        
        result = await self.export_data(export_data)
        return result.file_name

    async def _export_full(self, include_presets: bool) -> dict:
        """导出完整数据"""
        # 获取所有数据
        typing_sessions = await TypingSession.all().values()
        typing_results = await TypingResult.all().values()
        
        if include_presets:
            contents = await Content.all().values()
        else:
            contents = await Content.filter(is_preset=False).values()
        
        articles = await Article.all().values()
        user_progress = await UserProgress.all().values()
        achievements = await Achievement.all().values()
        word_progress = await WordProgress.all().values()
        
        return {
            "type": "full",
            "export_time": datetime.now().isoformat(),
            "record_count": (
                len(typing_sessions) + len(typing_results) + len(contents) +
                len(articles) + len(user_progress) + len(achievements) +
                len(word_progress)
            ),
            "data": {
                "typing_sessions": typing_sessions,
                "typing_results": typing_results,
                "contents": contents,
                "articles": articles,
                "user_progress": user_progress,
                "achievements": achievements,
                "word_progress": word_progress,
            },
        }

    async def _export_progress(self) -> dict:
        """导出进度数据"""
        typing_sessions = await TypingSession.all().values()
        typing_results = await TypingResult.all().values()
        user_progress = await UserProgress.all().values()
        achievements = await Achievement.all().values()
        word_progress = await WordProgress.all().values()
        
        return {
            "type": "progress",
            "export_time": datetime.now().isoformat(),
            "record_count": (
                len(typing_sessions) + len(typing_results) + len(user_progress) +
                len(achievements) + len(word_progress)
            ),
            "data": {
                "typing_sessions": typing_sessions,
                "typing_results": typing_results,
                "user_progress": user_progress,
                "achievements": achievements,
                "word_progress": word_progress,
            },
        }

    async def _export_content(self, include_presets: bool) -> dict:
        """导出内容数据"""
        if include_presets:
            contents = await Content.all().values()
        else:
            contents = await Content.filter(is_preset=False).values()
        
        articles = await Article.all().values()
        
        return {
            "type": "content",
            "export_time": datetime.now().isoformat(),
            "record_count": len(contents) + len(articles),
            "data": {
                "contents": contents,
                "articles": articles,
            },
        }

    async def _import_full(self, data: dict) -> dict:
        """导入完整数据"""
        imported = 0
        skipped = 0
        errors = []
        
        # 导入内容
        for content_data in data["data"]["contents"]:
            try:
                await Content.create(**content_data)
                imported += 1
            except Exception as e:
                errors.append(f"导入内容失败：{str(e)}")
                skipped += 1
        
        # 导入文章
        for article_data in data["data"]["articles"]:
            try:
                await Article.create(**article_data)
                imported += 1
            except Exception as e:
                errors.append(f"导入文章失败：{str(e)}")
                skipped += 1
        
        # 导入进度数据
        for progress_data in data["data"]["user_progress"]:
            try:
                await UserProgress.create(**progress_data)
                imported += 1
            except Exception as e:
                errors.append(f"导入进度失败：{str(e)}")
                skipped += 1
        
        # 导入成就
        for achievement_data in data["data"]["achievements"]:
            try:
                await Achievement.create(**achievement_data)
                imported += 1
            except Exception as e:
                errors.append(f"导入成就失败：{str(e)}")
                skipped += 1
        
        # 导入单词进度
        for word_data in data["data"]["word_progress"]:
            try:
                await WordProgress.create(**word_data)
                imported += 1
            except Exception as e:
                errors.append(f"导入单词进度失败：{str(e)}")
                skipped += 1
        
        return {
            "imported": imported,
            "skipped": skipped,
            "errors": errors,
        }

    async def _import_progress(self, data: dict) -> dict:
        """导入进度数据"""
        imported = 0
        skipped = 0
        errors = []
        
        # 导入进度数据
        for progress_data in data["data"]["user_progress"]:
            try:
                await UserProgress.create(**progress_data)
                imported += 1
            except Exception as e:
                errors.append(f"导入进度失败：{str(e)}")
                skipped += 1
        
        # 导入成就
        for achievement_data in data["data"]["achievements"]:
            try:
                await Achievement.create(**achievement_data)
                imported += 1
            except Exception as e:
                errors.append(f"导入成就失败：{str(e)}")
                skipped += 1
        
        # 导入单词进度
        for word_data in data["data"]["word_progress"]:
            try:
                await WordProgress.create(**word_data)
                imported += 1
            except Exception as e:
                errors.append(f"导入单词进度失败：{str(e)}")
                skipped += 1
        
        return {
            "imported": imported,
            "skipped": skipped,
            "errors": errors,
        }

    async def _import_content(self, data: dict) -> dict:
        """导入内容数据"""
        imported = 0
        skipped = 0
        errors = []
        
        # 导入内容
        for content_data in data["data"]["contents"]:
            try:
                await Content.create(**content_data)
                imported += 1
            except Exception as e:
                errors.append(f"导入内容失败：{str(e)}")
                skipped += 1
        
        # 导入文章
        for article_data in data["data"]["articles"]:
            try:
                await Article.create(**article_data)
                imported += 1
            except Exception as e:
                errors.append(f"导入文章失败：{str(e)}")
                skipped += 1
        
        return {
            "imported": imported,
            "skipped": skipped,
            "errors": errors,
        }
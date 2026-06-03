from typing import List, Optional
from datetime import datetime, timedelta
from tortoise.expressions import Q

from app.models.progress import UserProgress, Achievement, WordProgress
from app.models.typing import TypingSession
from app.schemas.progress import (
    UserProgressResponse,
    AchievementResponse,
    AchievementList,
    WordProgressResponse,
    WordProgressList,
    ProgressDashboard,
    ProgressHistory,
)


class ProgressService:
    """进度跟踪服务"""

    async def get_dashboard(self) -> ProgressDashboard:
        """获取进度仪表板"""
        # 获取或创建用户进度
        user_progress = await UserProgress.first()
        if not user_progress:
            user_progress = await UserProgress.create()
        
        # 获取最近会话
        recent_sessions = await TypingSession.filter(
            is_completed=True
        ).order_by("-start_time").limit(10).values(
            "id", "content_type", "start_time", "duration", "wpm", "accuracy"
        )
        
        # 获取成就
        achievements = await Achievement.filter(
            is_unlocked=True
        ).order_by("-unlocked_at").limit(5)
        
        # 获取统计信息
        statistics = await self._get_statistics()
        
        return ProgressDashboard(
            user_progress=UserProgressResponse.from_orm(user_progress),
            recent_sessions=recent_sessions,
            achievements=[AchievementResponse.from_orm(a) for a in achievements],
            statistics=statistics,
        )

    async def get_history(
        self,
        page: int = 1,
        size: int = 20,
        content_type: Optional[str] = None,
    ) -> ProgressHistory:
        """获取进度历史"""
        query = TypingSession.filter(is_completed=True)
        
        if content_type:
            query = query.filter(content_type=content_type)
        
        # 计算总数
        total = await query.count()
        
        # 分页
        sessions = await query.offset((page - 1) * size).limit(size).order_by("-start_time").values(
            "id", "content_type", "start_time", "duration", "wpm", "accuracy", "total_chars", "correct_chars"
        )
        
        # 计算总页数
        pages = (total + size - 1) // size
        
        return ProgressHistory(
            sessions=sessions,
            total=total,
            page=page,
            size=size,
            pages=pages,
        )

    async def get_achievements(
        self,
        category: Optional[str] = None,
        is_unlocked: Optional[bool] = None,
    ) -> AchievementList:
        """获取成就列表"""
        query = Achievement.all()
        
        if category:
            query = query.filter(category=category)
        if is_unlocked is not None:
            query = query.filter(is_unlocked=is_unlocked)
        
        achievements = await query.order_by("-created_at")
        total = len(achievements)
        unlocked_count = sum(1 for a in achievements if a.is_unlocked)
        
        return AchievementList(
            achievements=[AchievementResponse.from_orm(a) for a in achievements],
            total=total,
            unlocked_count=unlocked_count,
        )

    async def unlock_achievement(self, achievement_id: int) -> Optional[AchievementResponse]:
        """解锁成就"""
        achievement = await Achievement.get_or_none(id=achievement_id)
        if not achievement:
            return None
        
        if achievement.is_unlocked:
            return AchievementResponse.from_orm(achievement)
        
        achievement.is_unlocked = True
        achievement.unlocked_at = datetime.now()
        await achievement.save()
        
        # 增加经验值
        user_progress = await UserProgress.first()
        if user_progress:
            user_progress.experience += achievement.experience_reward
            await user_progress.save()
        
        return AchievementResponse.from_orm(achievement)

    async def get_word_progress(
        self,
        page: int = 1,
        size: int = 20,
        mastery_level: Optional[int] = None,
    ) -> WordProgressList:
        """获取单词进度"""
        query = WordProgress.all()
        
        if mastery_level is not None:
            query = query.filter(mastery_level=mastery_level)
        
        # 计算总数
        total = await query.count()
        
        # 分页
        words = await query.offset((page - 1) * size).limit(size).order_by("-updated_at")
        
        # 计算总页数
        pages = (total + size - 1) // size
        
        return WordProgressList(
            words=[WordProgressResponse.from_orm(w) for w in words],
            total=total,
            page=page,
            size=size,
            pages=pages,
        )

    async def update_word_progress(
        self, word_id: int, is_correct: bool
    ) -> Optional[WordProgressResponse]:
        """更新单词进度"""
        word = await WordProgress.get_or_none(id=word_id)
        if not word:
            return None
        
        word.practice_count += 1
        if is_correct:
            word.correct_count += 1
        
        # 计算准确率
        word.accuracy = (word.correct_count / word.practice_count) * 100
        
        # 更新掌握程度
        word.mastery_level = self._calculate_mastery_level(word.accuracy, word.practice_count)
        
        word.last_practice_date = datetime.now()
        await word.save()
        
        return WordProgressResponse.from_orm(word)

    async def _get_statistics(self) -> dict:
        """获取统计信息"""
        sessions = await TypingSession.filter(is_completed=True)
        
        if not sessions:
            return {
                "total_sessions": 0,
                "total_duration": 0,
                "average_wpm": 0,
                "average_accuracy": 0,
                "practice_days": 0,
            }
        
        total_sessions = len(sessions)
        total_duration = sum(s.duration for s in sessions)
        average_wpm = sum(s.wpm for s in sessions) / total_sessions
        average_accuracy = sum(s.accuracy for s in sessions) / total_sessions
        
        # 计算练习天数
        practice_dates = set()
        for s in sessions:
            if s.start_time:
                practice_dates.add(s.start_time.date())
        practice_days = len(practice_dates)
        
        return {
            "total_sessions": total_sessions,
            "total_duration": total_duration,
            "average_wpm": average_wpm,
            "average_accuracy": average_accuracy,
            "practice_days": practice_days,
        }

    def _calculate_mastery_level(self, accuracy: float, practice_count: int) -> int:
        """计算掌握程度"""
        if practice_count < 3:
            return 0
        elif accuracy < 60:
            return 1
        elif accuracy < 70:
            return 2
        elif accuracy < 80:
            return 3
        elif accuracy < 90:
            return 4
        else:
            return 5

    async def get_leaderboard(self, sort_by: str = "wpm", limit: int = 10) -> dict:
        """获取排行榜"""
        # 获取所有完成的会话
        sessions = await TypingSession.filter(is_completed=True)
        
        if not sessions:
            return {
                "rankings": [],
                "sort_by": sort_by,
                "total": 0,
            }
        
        # 按会话统计（每次练习记录）
        session_records = []
        for s in sessions:
            session_records.append({
                "id": s.id,
                "content_type": s.content_type,
                "wpm": s.wpm,
                "accuracy": s.accuracy,
                "total_chars": s.total_chars,
                "correct_chars": s.correct_chars,
                "duration": s.duration,
                "start_time": s.start_time.isoformat() if s.start_time else None,
            })
        
        # 排序
        if sort_by == "wpm":
            session_records.sort(key=lambda x: x["wpm"], reverse=True)
        elif sort_by == "accuracy":
            session_records.sort(key=lambda x: x["accuracy"], reverse=True)
        elif sort_by == "chars":
            session_records.sort(key=lambda x: x["total_chars"], reverse=True)
        elif sort_by == "duration":
            session_records.sort(key=lambda x: x["duration"], reverse=True)
        
        # 添加排名
        for i, record in enumerate(session_records[:limit]):
            record["rank"] = i + 1
        
        return {
            "rankings": session_records[:limit],
            "sort_by": sort_by,
            "total": len(sessions),
        }
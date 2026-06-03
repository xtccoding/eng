from typing import List, Optional
from datetime import datetime
from tortoise.expressions import Q

from app.models.typing import TypingSession, TypingResult
from app.schemas.typing import (
    TypingSessionCreate,
    TypingSessionResponse,
    TypingResultCreate,
    TypingResultResponse,
    TypingStats,
    TypingSessionList,
)


class TypingService:
    """打字练习服务"""

    async def create_session(self, session_data: TypingSessionCreate) -> TypingSessionResponse:
        """创建打字练习会话"""
        session = await TypingSession.create(
            content_id=session_data.content_id,
            content_type=session_data.content_type,
            start_time=datetime.now(),
        )
        return TypingSessionResponse.from_orm(session)

    async def submit_result(self, result_data: TypingResultCreate) -> TypingResultResponse:
        """提交打字结果"""
        # 检查会话是否存在
        session = await TypingSession.get_or_none(id=result_data.session_id)
        if not session:
            raise ValueError("会话不存在")
        
        # 创建结果记录
        result = await TypingResult.create(
            session_id=result_data.session_id,
            char_index=result_data.char_index,
            expected_char=result_data.expected_char,
            typed_char=result_data.typed_char,
            is_correct=result_data.is_correct,
            time_taken=result_data.time_taken,
        )
        
        # 更新会话统计
        await self._update_session_stats(session)
        
        return TypingResultResponse.from_orm(result)

    async def complete_session(self, session_id: int) -> TypingSessionResponse:
        """完成打字练习会话"""
        session = await TypingSession.get_or_none(id=session_id)
        if not session:
            raise ValueError("会话不存在")
        
        # 计算最终统计
        results = await TypingResult.filter(session_id=session_id)
        total_chars = len(results)
        correct_chars = sum(1 for r in results if r.is_correct)
        
        # 计算时长
        if session.start_time:
            duration = (datetime.now() - session.start_time).total_seconds()
        else:
            duration = 0
        
        # 计算WPM（假设每个单词5个字符）
        if duration > 0:
            wpm = (correct_chars / 5) / (duration / 60)
        else:
            wpm = 0
        
        # 计算准确率
        accuracy = (correct_chars / total_chars * 100) if total_chars > 0 else 0
        
        # 更新会话
        session.end_time = datetime.now()
        session.duration = duration
        session.total_chars = total_chars
        session.correct_chars = correct_chars
        session.wpm = wpm
        session.accuracy = accuracy
        session.is_completed = True
        await session.save()
        
        return TypingSessionResponse.from_orm(session)

    async def get_sessions(
        self,
        page: int = 1,
        size: int = 20,
        content_type: Optional[str] = None,
    ) -> TypingSessionList:
        """获取打字练习会话列表"""
        query = TypingSession.all()
        
        if content_type:
            query = query.filter(content_type=content_type)
        
        # 计算总数
        total = await query.count()
        
        # 分页
        sessions = await query.offset((page - 1) * size).limit(size).order_by("-start_time")
        
        # 计算总页数
        pages = (total + size - 1) // size
        
        return TypingSessionList(
            sessions=[TypingSessionResponse.from_orm(s) for s in sessions],
            total=total,
            page=page,
            size=size,
            pages=pages,
        )

    async def get_session(self, session_id: int) -> Optional[TypingSessionResponse]:
        """获取打字练习会话详情"""
        session = await TypingSession.get_or_none(id=session_id)
        if not session:
            return None
        return TypingSessionResponse.from_orm(session)

    async def get_statistics(self) -> TypingStats:
        """获取打字统计信息"""
        sessions = await TypingSession.filter(is_completed=True)
        
        if not sessions:
            return TypingStats(
                total_sessions=0,
                total_duration=0,
                total_chars=0,
                total_correct_chars=0,
                average_wpm=0,
                average_accuracy=0,
                best_wpm=0,
                best_accuracy=0,
                practice_days=0,
                current_streak=0,
            )
        
        total_sessions = len(sessions)
        total_duration = sum(s.duration for s in sessions)
        total_chars = sum(s.total_chars for s in sessions)
        total_correct_chars = sum(s.correct_chars for s in sessions)
        
        # 计算平均值
        average_wpm = sum(s.wpm for s in sessions) / total_sessions
        average_accuracy = sum(s.accuracy for s in sessions) / total_sessions
        
        # 计算最佳值
        best_wpm = max(s.wpm for s in sessions)
        best_accuracy = max(s.accuracy for s in sessions)
        
        # 计算练习天数
        practice_dates = set()
        for s in sessions:
            if s.start_time:
                practice_dates.add(s.start_time.date())
        practice_days = len(practice_dates)
        
        # 计算连续天数
        current_streak = self._calculate_streak(sessions)
        
        return TypingStats(
            total_sessions=total_sessions,
            total_duration=total_duration,
            total_chars=total_chars,
            total_correct_chars=total_correct_chars,
            average_wpm=average_wpm,
            average_accuracy=average_accuracy,
            best_wpm=best_wpm,
            best_accuracy=best_accuracy,
            practice_days=practice_days,
            current_streak=current_streak,
        )

    async def _update_session_stats(self, session: TypingSession):
        """更新会话统计"""
        results = await TypingResult.filter(session_id=session.id)
        total_chars = len(results)
        correct_chars = sum(1 for r in results if r.is_correct)
        
        session.total_chars = total_chars
        session.correct_chars = correct_chars
        
        # 计算实时WPM
        if session.start_time:
            duration = (datetime.now() - session.start_time).total_seconds()
            if duration > 0:
                session.wpm = (correct_chars / 5) / (duration / 60)
        
        # 计算实时准确率
        if total_chars > 0:
            session.accuracy = (correct_chars / total_chars) * 100
        
        await session.save()

    def _calculate_streak(self, sessions: List[TypingSession]) -> int:
        """计算连续练习天数"""
        if not sessions:
            return 0
        
        # 获取所有练习日期
        practice_dates = set()
        for s in sessions:
            if s.start_time:
                practice_dates.add(s.start_time.date())
        
        if not practice_dates:
            return 0
        
        # 转换为排序列表
        sorted_dates = sorted(practice_dates, reverse=True)
        
        # 计算连续天数
        streak = 1
        for i in range(len(sorted_dates) - 1):
            current_date = sorted_dates[i]
            next_date = sorted_dates[i + 1]
            
            # 检查是否连续
            if (current_date - next_date).days == 1:
                streak += 1
            else:
                break
        
        return streak
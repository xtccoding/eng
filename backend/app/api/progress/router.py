from fastapi import APIRouter, HTTPException
from typing import List, Optional

from app.schemas.progress import (
    UserProgressResponse,
    AchievementResponse,
    AchievementList,
    WordProgressResponse,
    WordProgressList,
    ProgressDashboard,
    ProgressHistory,
)
from app.services.progress.progress_service import ProgressService

router = APIRouter()
progress_service = ProgressService()


@router.get("/dashboard", response_model=ProgressDashboard)
async def get_progress_dashboard():
    """获取进度仪表板"""
    try:
        dashboard = await progress_service.get_dashboard()
        return dashboard
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/history", response_model=ProgressHistory)
async def get_progress_history(
    page: int = 1,
    size: int = 20,
    content_type: Optional[str] = None,
):
    """获取进度历史"""
    try:
        history = await progress_service.get_history(page, size, content_type)
        return history
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/achievements", response_model=AchievementList)
async def get_achievements(
    category: Optional[str] = None,
    is_unlocked: Optional[bool] = None,
):
    """获取成就列表"""
    try:
        achievements = await progress_service.get_achievements(category, is_unlocked)
        return achievements
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/achievements/{achievement_id}/unlock")
async def unlock_achievement(achievement_id: int):
    """解锁成就"""
    try:
        achievement = await progress_service.unlock_achievement(achievement_id)
        if not achievement:
            raise HTTPException(status_code=404, detail="成就不存在")
        return achievement
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/words", response_model=WordProgressList)
async def get_word_progress(
    page: int = 1,
    size: int = 20,
    mastery_level: Optional[int] = None,
):
    """获取单词进度"""
    try:
        words = await progress_service.get_word_progress(page, size, mastery_level)
        return words
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/words/{word_id}/update")
async def update_word_progress(word_id: int, is_correct: bool):
    """更新单词进度"""
    try:
        word = await progress_service.update_word_progress(word_id, is_correct)
        if not word:
            raise HTTPException(status_code=404, detail="单词不存在")
        return word
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/leaderboard")
async def get_leaderboard(
    sort_by: str = "wpm",
    limit: int = 10,
):
    """获取排行榜"""
    try:
        leaderboard = await progress_service.get_leaderboard(sort_by, limit)
        return leaderboard
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
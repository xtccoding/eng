from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class UserProgressResponse(BaseModel):
    """用户进度响应"""
    id: int
    total_practice_time: float
    total_sessions: int
    total_chars_typed: int
    total_correct_chars: int
    average_wpm: float
    average_accuracy: float
    best_wpm: float
    best_accuracy: float
    current_streak: int
    longest_streak: int
    last_practice_date: Optional[datetime]
    level: int
    experience: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AchievementResponse(BaseModel):
    """成就响应"""
    id: int
    name: str
    description: str
    icon: str
    category: str
    requirement_type: str
    requirement_value: int
    experience_reward: int
    is_unlocked: bool
    unlocked_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class AchievementList(BaseModel):
    """成就列表"""
    achievements: List[AchievementResponse]
    total: int
    unlocked_count: int


class WordProgressResponse(BaseModel):
    """单词进度响应"""
    id: int
    word: str
    translation: str
    content_id: int
    practice_count: int
    correct_count: int
    accuracy: float
    last_practice_date: Optional[datetime]
    mastery_level: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class WordProgressList(BaseModel):
    """单词进度列表"""
    words: List[WordProgressResponse]
    total: int
    page: int
    size: int
    pages: int


class ProgressDashboard(BaseModel):
    """进度仪表板"""
    user_progress: UserProgressResponse
    recent_sessions: List[dict]
    achievements: List[AchievementResponse]
    statistics: dict


class ProgressHistory(BaseModel):
    """进度历史"""
    sessions: List[dict]
    total: int
    page: int
    size: int
    pages: int
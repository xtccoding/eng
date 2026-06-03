from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class TypingSessionCreate(BaseModel):
    """创建打字练习会话请求"""
    content_id: int = Field(description="内容ID")
    content_type: str = Field(description="内容类型：speech/vocabulary/ielts/article")


class TypingSessionResponse(BaseModel):
    """打字练习会话响应"""
    id: int
    content_id: int
    content_type: str
    start_time: datetime
    end_time: Optional[datetime]
    duration: float
    total_chars: int
    correct_chars: int
    wpm: float
    accuracy: float
    is_completed: bool

    class Config:
        from_attributes = True


class TypingResultCreate(BaseModel):
    """创建打字结果请求"""
    session_id: int = Field(description="会话ID")
    char_index: int = Field(description="字符位置")
    expected_char: str = Field(description="期望字符")
    typed_char: str = Field(description="实际输入字符")
    is_correct: bool = Field(description="是否正确")
    time_taken: float = Field(description="输入耗时（毫秒）")


class TypingResultResponse(BaseModel):
    """打字结果响应"""
    id: int
    session_id: int
    char_index: int
    expected_char: str
    typed_char: str
    is_correct: bool
    time_taken: float
    timestamp: datetime

    class Config:
        from_attributes = True


class TypingStats(BaseModel):
    """打字统计信息"""
    total_sessions: int
    total_duration: float
    total_chars: int
    total_correct_chars: int
    average_wpm: float
    average_accuracy: float
    best_wpm: float
    best_accuracy: float
    practice_days: int
    current_streak: int


class TypingSessionList(BaseModel):
    """打字练习会话列表"""
    sessions: List[TypingSessionResponse]
    total: int
    page: int
    size: int
    pages: int
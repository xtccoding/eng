from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime

from app.schemas.typing import (
    TypingSessionCreate,
    TypingSessionResponse,
    TypingResultCreate,
    TypingResultResponse,
    TypingStats,
    TypingSessionList,
)
from app.services.typing.typing_service import TypingService

router = APIRouter()
typing_service = TypingService()


@router.post("/start", response_model=TypingSessionResponse)
async def start_typing_session(session_data: TypingSessionCreate):
    """开始打字练习会话"""
    try:
        session = await typing_service.create_session(session_data)
        return session
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/submit", response_model=TypingResultResponse)
async def submit_typing_result(result_data: TypingResultCreate):
    """提交打字结果"""
    try:
        result = await typing_service.submit_result(result_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/complete/{session_id}", response_model=TypingSessionResponse)
async def complete_session(session_id: int):
    """完成打字练习会话"""
    try:
        session = await typing_service.complete_session(session_id)
        return session
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/sessions", response_model=TypingSessionList)
async def get_typing_sessions(
    page: int = 1,
    size: int = 20,
    content_type: Optional[str] = None,
):
    """获取打字练习会话列表"""
    try:
        sessions = await typing_service.get_sessions(page, size, content_type)
        return sessions
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/sessions/{session_id}", response_model=TypingSessionResponse)
async def get_typing_session(session_id: int):
    """获取打字练习会话详情"""
    try:
        session = await typing_service.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="会话不存在")
        return session
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/statistics", response_model=TypingStats)
async def get_typing_statistics():
    """获取打字统计信息"""
    try:
        stats = await typing_service.get_statistics()
        return stats
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
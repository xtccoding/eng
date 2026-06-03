from fastapi import APIRouter, HTTPException
from typing import List, Optional

from app.schemas.generation import (
    SearchRequest,
    SearchResponse,
    GenerateRequest,
    GenerateResponse,
    SuggestionsResponse,
)
from app.services.generation.generation_service import GenerationService

router = APIRouter()
generation_service = GenerationService()


@router.post("/search", response_model=SearchResponse)
async def search_articles(search_data: SearchRequest):
    """搜索最新文章"""
    try:
        results = await generation_service.search_articles(search_data)
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/generate", response_model=GenerateResponse)
async def generate_content(generate_data: GenerateRequest):
    """生成学习内容"""
    try:
        content = await generation_service.generate_content(generate_data)
        return content
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/suggestions", response_model=SuggestionsResponse)
async def get_suggestions(
    content_type: Optional[str] = None,
    difficulty: Optional[str] = None,
):
    """获取内容建议"""
    try:
        suggestions = await generation_service.get_suggestions(content_type, difficulty)
        return suggestions
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/fetch")
async def fetch_article(url: str):
    """获取文章内容"""
    try:
        article = await generation_service.fetch_article(url)
        return article
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
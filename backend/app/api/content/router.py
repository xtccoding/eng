from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional

from app.schemas.content import (
    ContentCreate,
    ContentUpdate,
    ContentResponse,
    ContentList,
    ContentSearch,
)
from app.services.content.content_service import ContentService

router = APIRouter()
content_service = ContentService()


@router.get("/", response_model=ContentList)
async def get_contents(
    page: int = 1,
    size: int = 20,
    content_type: Optional[str] = None,
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
):
    """获取内容列表"""
    try:
        contents = await content_service.get_contents(
            page, size, content_type, category, difficulty
        )
        return contents
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{content_id}", response_model=ContentResponse)
async def get_content(content_id: int):
    """获取内容详情"""
    try:
        content = await content_service.get_content(content_id)
        if not content:
            raise HTTPException(status_code=404, detail="内容不存在")
        return content
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/", response_model=ContentResponse)
async def create_content(content_data: ContentCreate):
    """创建内容"""
    try:
        content = await content_service.create_content(content_data)
        return content
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{content_id}", response_model=ContentResponse)
async def update_content(content_id: int, content_data: ContentUpdate):
    """更新内容"""
    try:
        content = await content_service.update_content(content_id, content_data)
        if not content:
            raise HTTPException(status_code=404, detail="内容不存在")
        return content
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{content_id}")
async def delete_content(content_id: int):
    """删除内容"""
    try:
        success = await content_service.delete_content(content_id)
        if not success:
            raise HTTPException(status_code=404, detail="内容不存在")
        return {"message": "删除成功"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/types/", response_model=List[str])
async def get_content_types():
    """获取内容类型列表"""
    try:
        types = await content_service.get_content_types()
        return types
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/categories/", response_model=List[str])
async def get_categories():
    """获取分类列表"""
    try:
        categories = await content_service.get_categories()
        return categories
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/search", response_model=ContentList)
async def search_contents(search_data: ContentSearch):
    """搜索内容"""
    try:
        contents = await content_service.search_contents(search_data)
        return contents
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
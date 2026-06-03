from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class ContentCreate(BaseModel):
    """创建内容请求"""
    title: str = Field(max_length=200, description="标题")
    content_type: str = Field(description="内容类型：speech/vocabulary/ielts/article")
    category: str = Field(max_length=100, description="分类")
    difficulty: str = Field(description="难度：easy/medium/hard")
    content_text: str = Field(description="内容文本")
    translation: Optional[str] = Field(None, description="翻译")
    audio_url: Optional[str] = Field(None, max_length=500, description="音频URL")
    tags: Optional[List[str]] = Field(None, description="标签")
    source: Optional[str] = Field(None, max_length=200, description="来源")


class ContentUpdate(BaseModel):
    """更新内容请求"""
    title: Optional[str] = Field(None, max_length=200, description="标题")
    content_type: Optional[str] = Field(None, description="内容类型")
    category: Optional[str] = Field(None, max_length=100, description="分类")
    difficulty: Optional[str] = Field(None, description="难度")
    content_text: Optional[str] = Field(None, description="内容文本")
    translation: Optional[str] = Field(None, description="翻译")
    audio_url: Optional[str] = Field(None, max_length=500, description="音频URL")
    tags: Optional[List[str]] = Field(None, description="标签")
    source: Optional[str] = Field(None, max_length=200, description="来源")


class ContentResponse(BaseModel):
    """内容响应"""
    id: int
    title: str
    content_type: str
    category: str
    difficulty: str
    content_text: str
    translation: Optional[str]
    audio_url: Optional[str]
    tags: Optional[List[str]]
    source: Optional[str]
    is_preset: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ContentList(BaseModel):
    """内容列表"""
    contents: List[ContentResponse]
    total: int
    page: int
    size: int
    pages: int


class ContentSearch(BaseModel):
    """内容搜索请求"""
    query: str = Field(description="搜索关键词")
    content_type: Optional[str] = Field(None, description="内容类型")
    category: Optional[str] = Field(None, description="分类")
    difficulty: Optional[str] = Field(None, description="难度")
    page: int = Field(1, description="页码")
    size: int = Field(20, description="每页数量")
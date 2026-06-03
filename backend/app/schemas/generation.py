from pydantic import BaseModel, Field
from typing import List, Optional


class SearchRequest(BaseModel):
    """搜索请求"""
    query: str = Field(description="搜索关键词")
    content_type: Optional[str] = Field(None, description="内容类型")
    difficulty: Optional[str] = Field(None, description="难度")
    max_results: int = Field(10, description="最大结果数")
    language: str = Field("en", description="语言")


class SearchResult(BaseModel):
    """搜索结果"""
    title: str
    url: str
    snippet: str
    source: str
    published_date: Optional[str]


class SearchResponse(BaseModel):
    """搜索响应"""
    results: List[SearchResult]
    total: int
    query: str


class GenerateRequest(BaseModel):
    """生成请求"""
    topic: str = Field(description="主题")
    content_type: str = Field(description="内容类型：speech/vocabulary/ielts/article")
    difficulty: str = Field(description="难度：easy/medium/hard")
    length: int = Field(500, description="长度（字符数）")
    language: str = Field("en", description="语言")
    include_translation: bool = Field(True, description="是否包含翻译")


class GenerateResponse(BaseModel):
    """生成响应"""
    title: str
    content: str
    translation: Optional[str]
    content_type: str
    difficulty: str
    word_count: int
    tags: List[str]


class SuggestionsResponse(BaseModel):
    """建议响应"""
    topics: List[str]
    categories: List[str]
    difficulties: List[str]
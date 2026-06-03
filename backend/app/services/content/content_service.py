from typing import List, Optional
from tortoise.expressions import Q

from app.models.content import Content, Article
from app.schemas.content import (
    ContentCreate,
    ContentUpdate,
    ContentResponse,
    ContentList,
    ContentSearch,
)


class ContentService:
    """内容管理服务"""

    async def get_contents(
        self,
        page: int = 1,
        size: int = 20,
        content_type: Optional[str] = None,
        category: Optional[str] = None,
        difficulty: Optional[str] = None,
    ) -> ContentList:
        """获取内容列表"""
        query = Content.all()
        
        if content_type:
            query = query.filter(content_type=content_type)
        if category:
            query = query.filter(category=category)
        if difficulty:
            query = query.filter(difficulty=difficulty)
        
        # 计算总数
        total = await query.count()
        
        # 分页
        contents = await query.offset((page - 1) * size).limit(size).order_by("-created_at")
        
        # 计算总页数
        pages = (total + size - 1) // size
        
        return ContentList(
            contents=[ContentResponse.from_orm(c) for c in contents],
            total=total,
            page=page,
            size=size,
            pages=pages,
        )

    async def get_content(self, content_id: int) -> Optional[ContentResponse]:
        """获取内容详情"""
        content = await Content.get_or_none(id=content_id)
        if not content:
            return None
        return ContentResponse.from_orm(content)

    async def create_content(self, content_data: ContentCreate) -> ContentResponse:
        """创建内容"""
        content = await Content.create(
            title=content_data.title,
            content_type=content_data.content_type,
            category=content_data.category,
            difficulty=content_data.difficulty,
            content_text=content_data.content_text,
            translation=content_data.translation,
            audio_url=content_data.audio_url,
            tags=content_data.tags,
            source=content_data.source,
            is_preset=False,
        )
        return ContentResponse.from_orm(content)

    async def update_content(
        self, content_id: int, content_data: ContentUpdate
    ) -> Optional[ContentResponse]:
        """更新内容"""
        content = await Content.get_or_none(id=content_id)
        if not content:
            return None
        
        # 更新字段
        update_data = content_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(content, field, value)
        
        await content.save()
        return ContentResponse.from_orm(content)

    async def delete_content(self, content_id: int) -> bool:
        """删除内容"""
        content = await Content.get_or_none(id=content_id)
        if not content:
            return False
        
        await content.delete()
        return True

    async def get_content_types(self) -> List[str]:
        """获取内容类型列表"""
        types = await Content.all().distinct().values_list("content_type", flat=True)
        return list(types)

    async def get_categories(self) -> List[str]:
        """获取分类列表"""
        categories = await Content.all().distinct().values_list("category", flat=True)
        return list(categories)

    async def search_contents(self, search_data: ContentSearch) -> ContentList:
        """搜索内容"""
        query = Content.all()
        
        # 关键词搜索
        if search_data.query:
            query = query.filter(
                Q(title__icontains=search_data.query) |
                Q(content_text__icontains=search_data.query) |
                Q(translation__icontains=search_data.query)
            )
        
        # 类型过滤
        if search_data.content_type:
            query = query.filter(content_type=search_data.content_type)
        
        # 分类过滤
        if search_data.category:
            query = query.filter(category=search_data.category)
        
        # 难度过滤
        if search_data.difficulty:
            query = query.filter(difficulty=search_data.difficulty)
        
        # 计算总数
        total = await query.count()
        
        # 分页
        contents = await query.offset((search_data.page - 1) * search_data.size).limit(search_data.size).order_by("-created_at")
        
        # 计算总页数
        pages = (total + search_data.size - 1) // search_data.size
        
        return ContentList(
            contents=[ContentResponse.from_orm(c) for c in contents],
            total=total,
            page=search_data.page,
            size=search_data.size,
            pages=pages,
        )
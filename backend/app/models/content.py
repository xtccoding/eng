from tortoise import fields
from tortoise.models import Model


class Content(Model):
    """学习内容模型"""
    id = fields.IntField(pk=True)
    title = fields.CharField(max_length=200, description="标题")
    content_type = fields.CharField(max_length=50, description="内容类型：speech/vocabulary/ielts/article")
    category = fields.CharField(max_length=100, description="分类")
    difficulty = fields.CharField(max_length=20, description="难度：easy/medium/hard")
    content_text = fields.TextField(description="内容文本")
    translation = fields.TextField(null=True, description="翻译")
    audio_url = fields.CharField(max_length=500, null=True, description="音频URL")
    tags = fields.JSONField(null=True, description="标签")
    source = fields.CharField(max_length=200, null=True, description="来源")
    is_preset = fields.BooleanField(default=False, description="是否为预置内容")
    created_at = fields.DatetimeField(auto_now_add=True, description="创建时间")
    updated_at = fields.DatetimeField(auto_now=True, description="更新时间")
    
    class Meta:
        table = "contents"
        description = "学习内容"


class Article(Model):
    """动态生成的文章模型"""
    id = fields.IntField(pk=True)
    title = fields.CharField(max_length=200, description="标题")
    content = fields.TextField(description="文章内容")
    summary = fields.TextField(null=True, description="摘要")
    source_url = fields.CharField(max_length=500, null=True, description="来源URL")
    source_name = fields.CharField(max_length=100, null=True, description="来源名称")
    category = fields.CharField(max_length=100, description="分类")
    difficulty = fields.CharField(max_length=20, description="难度")
    word_count = fields.IntField(default=0, description="字数")
    tags = fields.JSONField(null=True, description="标签")
    is_generated = fields.BooleanField(default=False, description="是否为AI生成")
    created_at = fields.DatetimeField(auto_now_add=True, description="创建时间")
    
    class Meta:
        table = "articles"
        description = "动态生成的文章"
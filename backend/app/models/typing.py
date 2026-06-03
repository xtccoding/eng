from tortoise import fields
from tortoise.models import Model


class TypingSession(Model):
    """打字练习会话模型"""
    id = fields.IntField(pk=True)
    content_id = fields.IntField(description="关联的内容ID")
    content_type = fields.CharField(max_length=50, description="内容类型：speech/vocabulary/ielts/article")
    start_time = fields.DatetimeField(auto_now_add=True, description="开始时间")
    end_time = fields.DatetimeField(null=True, description="结束时间")
    duration = fields.FloatField(default=0, description="练习时长（秒）")
    total_chars = fields.IntField(default=0, description="总字符数")
    correct_chars = fields.IntField(default=0, description="正确字符数")
    wpm = fields.FloatField(default=0, description="每分钟字数")
    accuracy = fields.FloatField(default=0, description="准确率")
    is_completed = fields.BooleanField(default=False, description="是否完成")
    
    class Meta:
        table = "typing_sessions"
        description = "打字练习会话"


class TypingResult(Model):
    """打字结果详情模型"""
    id = fields.IntField(pk=True)
    session = fields.ForeignKeyField("models.TypingSession", related_name="results", description="关联的会话")
    char_index = fields.IntField(description="字符位置")
    expected_char = fields.CharField(max_length=10, description="期望字符")
    typed_char = fields.CharField(max_length=10, description="实际输入字符")
    is_correct = fields.BooleanField(description="是否正确")
    time_taken = fields.FloatField(description="输入耗时（毫秒）")
    timestamp = fields.DatetimeField(auto_now_add=True, description="记录时间")
    
    class Meta:
        table = "typing_results"
        description = "打字结果详情"
from tortoise import fields
from tortoise.models import Model


class UserProgress(Model):
    """用户学习进度模型"""
    id = fields.IntField(pk=True)
    total_practice_time = fields.FloatField(default=0, description="总练习时间（秒）")
    total_sessions = fields.IntField(default=0, description="总会话数")
    total_chars_typed = fields.IntField(default=0, description="总输入字符数")
    total_correct_chars = fields.IntField(default=0, description="总正确字符数")
    average_wpm = fields.FloatField(default=0, description="平均WPM")
    average_accuracy = fields.FloatField(default=0, description="平均准确率")
    best_wpm = fields.FloatField(default=0, description="最佳WPM")
    best_accuracy = fields.FloatField(default=0, description="最佳准确率")
    current_streak = fields.IntField(default=0, description="当前连续天数")
    longest_streak = fields.IntField(default=0, description="最长连续天数")
    last_practice_date = fields.DatetimeField(null=True, description="最后练习日期")
    level = fields.IntField(default=1, description="等级")
    experience = fields.IntField(default=0, description="经验值")
    created_at = fields.DatetimeField(auto_now_add=True, description="创建时间")
    updated_at = fields.DatetimeField(auto_now=True, description="更新时间")
    
    class Meta:
        table = "user_progress"
        description = "用户学习进度"


class Achievement(Model):
    """成就模型"""
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=100, description="成就名称")
    description = fields.TextField(description="成就描述")
    icon = fields.CharField(max_length=50, description="图标")
    category = fields.CharField(max_length=50, description="类别")
    requirement_type = fields.CharField(max_length=50, description="要求类型")
    requirement_value = fields.IntField(description="要求值")
    experience_reward = fields.IntField(default=0, description="经验奖励")
    is_unlocked = fields.BooleanField(default=False, description="是否已解锁")
    unlocked_at = fields.DatetimeField(null=True, description="解锁时间")
    created_at = fields.DatetimeField(auto_now_add=True, description="创建时间")
    
    class Meta:
        table = "achievements"
        description = "成就"


class WordProgress(Model):
    """单词学习进度模型"""
    id = fields.IntField(pk=True)
    word = fields.CharField(max_length=100, description="单词")
    translation = fields.CharField(max_length=200, description="翻译")
    content_id = fields.IntField(description="关联的内容ID")
    practice_count = fields.IntField(default=0, description="练习次数")
    correct_count = fields.IntField(default=0, description="正确次数")
    accuracy = fields.FloatField(default=0, description="准确率")
    last_practice_date = fields.DatetimeField(null=True, description="最后练习日期")
    mastery_level = fields.IntField(default=0, description="掌握程度：0-5")
    created_at = fields.DatetimeField(auto_now_add=True, description="创建时间")
    updated_at = fields.DatetimeField(auto_now=True, description="更新时间")
    
    class Meta:
        table = "word_progress"
        description = "单词学习进度"
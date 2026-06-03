from tortoise import fields
from tortoise.models import Model


class ExportRecord(Model):
    """导出记录模型"""
    id = fields.IntField(pk=True)
    export_type = fields.CharField(max_length=50, description="导出类型：full/progress/content")
    file_name = fields.CharField(max_length=200, description="文件名")
    file_path = fields.CharField(max_length=500, description="文件路径")
    file_size = fields.IntField(default=0, description="文件大小（字节）")
    record_count = fields.IntField(default=0, description="记录数")
    status = fields.CharField(max_length=20, default="completed", description="状态")
    created_at = fields.DatetimeField(auto_now_add=True, description="创建时间")
    
    class Meta:
        table = "export_records"
        description = "导出记录"
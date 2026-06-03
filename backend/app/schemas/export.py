from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class ExportRequest(BaseModel):
    """导出请求"""
    export_type: str = Field(description="导出类型：full/progress/content")
    include_presets: bool = Field(False, description="是否包含预置内容")
    format: str = Field("json", description="导出格式")


class ExportResponse(BaseModel):
    """导出响应"""
    file_name: str
    file_path: str
    file_size: int
    record_count: int
    export_type: str
    created_at: datetime


class ImportResponse(BaseModel):
    """导入响应"""
    success: bool
    message: str
    imported_records: int
    skipped_records: int
    errors: List[str]


class ExportRecordResponse(BaseModel):
    """导出记录响应"""
    id: int
    export_type: str
    file_name: str
    file_path: str
    file_size: int
    record_count: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
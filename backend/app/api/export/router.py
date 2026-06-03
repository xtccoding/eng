from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from typing import List
import os

from app.schemas.export import (
    ExportRequest,
    ExportResponse,
    ImportResponse,
    ExportRecordResponse,
)
from app.services.export.export_service import ExportService
from app.core.config import settings

router = APIRouter()
export_service = ExportService()


@router.post("/export", response_model=ExportResponse)
async def export_data(export_data: ExportRequest):
    """导出数据"""
    try:
        result = await export_service.export_data(export_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/import", response_model=ImportResponse)
async def import_data(file: UploadFile = File(...)):
    """导入数据"""
    try:
        # 保存上传的文件
        file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # 导入数据
        result = await export_service.import_data(file_path)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/download/{file_name}")
async def download_export(file_name: str):
    """下载导出文件"""
    try:
        file_path = os.path.join(settings.EXPORT_DIR, file_name)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="文件不存在")
        
        return FileResponse(
            path=file_path,
            filename=file_name,
            media_type="application/json",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/records", response_model=List[ExportRecordResponse])
async def get_export_records():
    """获取导出记录"""
    try:
        records = await export_service.get_export_records()
        return records
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/backup")
async def create_backup():
    """创建备份"""
    try:
        backup_file = await export_service.create_backup()
        return {"message": "备份创建成功", "file": backup_file}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
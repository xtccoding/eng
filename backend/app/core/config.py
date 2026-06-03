from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # 应用配置
    APP_NAME: str = "Xtcer Tool"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True
    
    # 数据库配置
    DATABASE_URL: str = "sqlite://db.sqlite3"
    
    # CORS配置
    CORS_ORIGINS: List[str] = ["http://localhost:10087", "http://localhost:5173"]
    
    # 外部API配置
    SEARCH_API_KEY: str = ""
    SEARCH_API_URL: str = "https://api.search.example.com"
    
    # 文件存储配置
    UPLOAD_DIR: str = "uploads"
    EXPORT_DIR: str = "exports"
    
    # 安全配置
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()


# 确保目录存在
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.EXPORT_DIR, exist_ok=True)
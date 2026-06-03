from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tortoise import Tortoise
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.typing.router import router as typing_router
from app.api.content.router import router as content_router
from app.api.progress.router import router as progress_router
from app.api.generation.router import router as generation_router
from app.api.export.router import router as export_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 初始化数据库
    await Tortoise.init(
        db_url=settings.DATABASE_URL,
        modules={"models": ["app.models.content", "app.models.typing", "app.models.progress", "app.models.export"]}
    )
    await Tortoise.generate_schemas()
    yield
    # 关闭数据库连接
    await Tortoise.close_connections()


app = FastAPI(
    title="Xtcer Tool API",
    description="打字学习网站后端API",
    version="0.1.0",
    lifespan=lifespan,
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(typing_router, prefix="/api/typing", tags=["打字练习"])
app.include_router(content_router, prefix="/api/content", tags=["内容管理"])
app.include_router(progress_router, prefix="/api/progress", tags=["进度跟踪"])
app.include_router(generation_router, prefix="/api/generation", tags=["内容生成"])
app.include_router(export_router, prefix="/api/export", tags=["导出导入"])


@app.get("/")
async def root():
    return {"message": "Xtcer Tool API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
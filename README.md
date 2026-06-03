# Xtcer Tool - 打字学习网站

一个综合性打字学习网站，通过打字练习学习英语，支持演讲稿、单词、雅思等内容。

![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?logo=cloudflare)

## ✨ 功能特点

### 核心功能
- 🎯 **打字练习** - 支持演讲稿、单词、雅思、文章等多种内容类型
- 📊 **实时统计** - WPM、准确率、连击数实时显示
- 🎮 **游戏化** - 打击感效果、粒子特效、音效反馈
- 🏆 **排行榜** - 速度、准确率、字数排行
- 📝 **内容管理** - 预置内容 + 自定义内容
- 🤖 **AI生成** - 通过API生成学习内容
- 📦 **数据导出** - JSON格式备份和恢复

### 打击感效果
- ✅ 按键音效（正确/错误不同声音）
- ✅ 粒子特效（正确时绿色✦，错误时红色✕）
- ✅ 连击系统（连续正确时显示连击数）
- ✅ 错误时震动效果

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React + TypeScript + Tailwind CSS + shadcn/ui |
| 状态管理 | Zustand |
| 构建工具 | Vite |
| 后端 | Python FastAPI + Tortoise ORM |
| 数据库 | SQLite |
| 部署 | Cloudflare Pages (前端) + Railway/Render (后端) |

## 🚀 快速开始

### 本地开发

```bash
# 1. 克隆项目
git clone https://github.com/YOUR_USERNAME/xtcer-tool.git
cd xtcer-tool

# 2. 启动后端
cd backend
pip install fastapi uvicorn tortoise-orm aiosqlite pydantic pydantic-settings python-multipart httpx
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 3. 启动前端（新终端）
cd frontend
npm install
npm run dev
```

访问 http://localhost:10087

### Windows 用户

双击运行 `start.bat` 即可启动服务。

## 📦 部署

### 前端部署到 Cloudflare Pages

1. **Fork 本项目到你的 GitHub**

2. **登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)**
   - 进入 Pages
   - 点击 "Create a project"
   - 连接 GitHub 仓库

3. **配置构建设置**
   ```
   Framework preset: Vite
   Build command: cd frontend && npm install && npm run build
   Build output directory: frontend/dist
   ```

4. **设置环境变量**
   ```
   VITE_API_URL = https://your-backend-url.com/api
   ```

5. **部署**

### 后端部署到 Railway

1. **登录 [Railway](https://railway.app/)**

2. **新建项目**
   - 从 GitHub 部署
   - 选择本仓库

3. **配置**
   ```
   Root directory: backend
   Start command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

4. **添加环境变量**
   ```
   DATABASE_URL=sqlite://db.sqlite3
   CORS_ORIGINS=["https://your-pages-url.pages.dev"]
   ```

5. **部署并获取后端 URL**

6. **回到 Cloudflare Pages，更新 `VITE_API_URL` 环境变量**

### 使用 GitHub Actions 自动部署

1. **设置 GitHub Secrets**
   - `CLOUDFLARE_API_TOKEN` - Cloudflare API Token
   - `CLOUDFLARE_ACCOUNT_ID` - Cloudflare Account ID
   - `VITE_API_URL` - 后端 API 地址

2. **推送到 main 分支，自动触发部署**

## 📁 项目结构

```
xtcer-tool/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 部署配置
├── backend/
│   ├── app/
│   │   ├── api/               # API 路由
│   │   ├── core/              # 配置
│   │   ├── models/            # 数据模型
│   │   ├── services/          # 业务逻辑
│   │   └── schemas/           # 数据验证
│   ├── main.py                # FastAPI 入口
│   └── pyproject.toml         # Python 依赖
├── frontend/
│   ├── src/
│   │   ├── components/        # React 组件
│   │   ├── pages/             # 页面
│   │   ├── stores/            # Zustand 状态
│   │   ├── services/          # API 服务
│   │   └── styles/            # 样式
│   ├── package.json
│   └── vite.config.ts
├── start.bat                  # Windows 启动脚本
└── README.md
```

## 🔧 环境变量

### 前端
| 变量 | 说明 | 默认值 |
|------|------|--------|
| `VITE_API_URL` | 后端 API 地址 | `/api` |

### 后端
| 变量 | 说明 | 默认值 |
|------|------|--------|
| `DATABASE_URL` | 数据库连接 | `sqlite://db.sqlite3` |
| `CORS_ORIGINS` | 允许的源 | `["http://localhost:10087"]` |

## 📄 License

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系

如有问题，请提交 Issue。
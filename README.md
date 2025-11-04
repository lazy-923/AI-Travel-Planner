# AI 旅行规划师

欢迎使用 AI 旅行规划师！本应用程序利用 AI 的强大功能，帮助您生成个性化的旅行行程。只需提供您的目的地、日期、预算和偏好，剩下的就交给 AI 吧。

## 功能特性

- **智能行程规划:** 支持语音或文本输入旅行详情。
- **预算管理:** AI 驱动的预算分析和开销追踪。
- **用户管理:** 保存和管理您的旅行计划。
- **地图集成:** 在地图上查看您的行程并进行导航。

## 技术栈

- **前端:** Next.js, Tailwind CSS
- **后端:** Python, FastAPI
- **数据库/认证:** Supabase
- **AI 服务:** 阿里百炼
- **地图服务:** 高德地图
- **语音识别:** Web Speech API

## 快速开始

### 环境要求

- Node.js
- Python
- Yarn (或 npm)

### 安装步骤

1.  **克隆仓库:**
    ```bash
    git clone https://github.com/your-username/ai-travel-planner.git
    cd ai-travel-planner
    ```

2.  **设置环境变量:**

    在项目根目录创建一个 `.env` 文件，复制 `.env.example` 的内容，并填入您的 API 密钥。

3.  **安装前端依赖:**
    ```bash
    cd frontend
    yarn install
    ```

4.  **安装后端依赖:**
    ```bash
    cd ../backend
    pip install -r requirements.txt
    ```

### 运行应用

1.  **启动后端服务:**
    ```bash
    cd backend
    uvicorn main:app --reload
    ```

2.  **启动前端开发服务:**
    ```bash
    cd frontend
    yarn dev
    ```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。
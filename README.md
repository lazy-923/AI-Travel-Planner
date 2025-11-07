# AI 旅行规划师 🚀

欢迎使用 AI 旅行规划师！这是一个智能应用，可以根据您的目的地、预算和兴趣，为您生成个性化的旅行计划。

## ✨ 一键启动

本项目已打包为 Docker 镜像，您无需关心复杂的环境配置，只需几个简单步骤即可在本地运行。

### 1. 环境准备

- **安装 Docker**: 请确保您的电脑上已经安装了 [Docker Desktop](https://www.docker.com/products/docker-desktop/)。

### 2. 配置文件

1.  创建一个新的文件夹，例如 `ai-travel-planner`。
2.  在该文件夹中，创建两个文件：
    *   `docker-compose.yml`
    *   `.env`

3.  **将以下内容复制到 `docker-compose.yml` 文件中：**

    ```yaml
    version: '3.8'

    services:
      frontend:
        image: crpi-hkaidf4zyzgd849x.cn-hangzhou.personal.cr.aliyuncs.com/ai-travel-planner-079/ai-travel-planner-frontend:latest
        ports:
          - "3000:3000"
        environment:
          - NEXT_PUBLIC_API_URL=http://backend:8000
        depends_on:
          - backend
        networks:
          - app-network

      backend:
        image: crpi-hkaidf4zyzgd849x.cn-hangzhou.personal.cr.aliyuncs.com/ai-travel-planner-079/ai-travel-planner-backend:latest
        ports:
          - "8000:8000"
        env_file:
          - ./.env
        networks:
          - app-network

    networks:
      app-network:
        driver: bridge
    ```

4.  **将以下内容复制到 `.env` 文件中，并填入您的 API 密钥：**

    > ⚠️ **重要**: 请将所有占位符替换为您自己的有效密钥和地址。

    ```env
    # 阿里百炼 API Key (https://help.aliyun.com/zh/dashscope/developer-reference/activate-dashscope-and-create-an-api-key)
    DASHSCOPE_API_KEY=YOUR_DASHSCOPE_API_KEY

    # Supabase (在项目的 Settings -> API 中找到)
    SUPABASE_URL=YOUR_SUPABASE_URL
    SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

    # 高德地图 Key (https://lbs.amap.com/dev/key/app)
    # 您需要为前端和后端分别申请两个 Key
    # 前端 Key (类型：Web 端)
    AMAP_KEY_FRONTEND=YOUR_AMAP_KEY_FOR_FRONTEND
    # 后端 Key (类型：Web 服务)
    AMAP_KEY_BACKEND=YOUR_AMAP_KEY_FOR_BACKEND
    ```

### 3. 启动应用

1.  打开您的终端（在 Windows 上是 PowerShell 或命令提示符，在 macOS 或 Linux 上是 Terminal）。
2.  使用 `cd` 命令进入您刚刚创建的 `ai-travel-planner` 文件夹。
3.  运行以下命令：

    ```bash
    docker-compose up
    ```

4.  Docker 将会自动下载所需的镜像并启动应用。首次启动可能需要一些时间。

### 4. 访问应用

- **前端界面**: 打开浏览器，访问 [http://localhost:3000](http://localhost:3000)
- **后端 API**: 后端服务运行在 [http://localhost:8000](http://localhost:8000)

现在，您可以开始使用 AI 旅行规划师了！
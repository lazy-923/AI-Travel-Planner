# AI 旅行规划师 🚀

欢迎使用 AI 旅行规划师！这是一个智能应用，可以根据您的目的地、预算和兴趣，为您生成个性化的旅行计划。

## ✨ 一键启动 (通过 GitHub Release)

本项目通过 Docker 提供一键启动体验。您无需关心代码或复杂的环境配置，只需遵循以下简单步骤即可在本地运行。

### 1. 环境准备

- **安装 Docker**: 请确保您的电脑上已经安装了 [Docker Desktop](https://www.docker.com/products/docker-desktop/)。

### 2. 下载配置文件

1.  前往本项目的 **[GitHub Releases 页面](https://github.com/lazy-923/AI-Travel-Planner/releases)**。
2.  在最新的 Release 版本中，下载 `docker-compose.yml` 和 `.env.example` 这两个文件。
3.  将这两个文件保存在您电脑上的同一个文件夹中（例如，新建一个名为 `ai-travel-planner` 的文件夹）。

### 3. 配置 API 密钥

1.  将 `.env.example` 文件重命名为 `.env`。
2.  用文本编辑器打开 `.env` 文件。
3.  根据文件中的注释和说明，填入您自己的 API 密钥。


### 4. 启动应用

1.  打开您的终端（在 Windows 上是 PowerShell 或命令提示符，在 macOS 或 Linux 上是 Terminal）。
2.  使用 `cd` 命令进入您保存配置文件的文件夹。
3.  运行以下命令：

    ```bash
    docker-compose up -d
    ```
    > ` -d` 参数会让应用在后台运行。

4.  Docker 将会自动下载最新的镜像并启动应用。首次启动可能需要一些时间。

### 5. 访问应用

- **前端界面**: 打开浏览器，访问 [http://localhost:3000](http://localhost:3000)
- **后端 API**: 后端服务运行在 [http://localhost:8000](http://localhost:8000)

现在，您可以开始使用 AI 旅行规划师了！如果需要停止应用，可以在同一个文件夹下运行 `docker-compose down`。
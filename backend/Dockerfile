# 1. 使用官方 Python 镜像作为基础镜像
FROM python:3.9-slim

# 2. 设置工作目录
WORKDIR /app

# 3. 安装依赖
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 4. 复制应用代码
COPY ./app /app/app

# 5. 暴露端口
EXPOSE 8000

# 6. 启动应用
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
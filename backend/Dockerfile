# Sử dụng Python 3.10 làm base image
FROM python:3.10-slim AS builder

# Đặt thư mục làm việc
WORKDIR /app

# Copy và cài đặt dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ mã nguồn
COPY . .

# Expose cổng 8000 cho ứng dụng FastAPI
EXPOSE 8000

# Khởi động ứng dụng FastAPI với uvicorn và chế độ reload
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

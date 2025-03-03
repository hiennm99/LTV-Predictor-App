# Build ứng dụng React bằng Node.js
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve file tĩnh bằng Nginx
FROM nginx:alpine

# Copy build từ builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose cổng Nginx (mặc định là 80)
EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]

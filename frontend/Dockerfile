FROM node:18 AS builder
WORKDIR /app

# Copy và cài đặt dependencies
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

# Serve file tĩnh bằng Nginx
FROM nginx:alpine

# Copy build từ builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy script để inject biến môi trường vào runtime
COPY docker/env.sh /docker-entrypoint.d/99-env.sh
RUN chmod +x /docker-entrypoint.d/99-env.sh

# Expose cổng Nginx
EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]

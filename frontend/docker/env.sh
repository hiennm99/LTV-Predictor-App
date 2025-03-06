#!/bin/sh
echo "Injecting environment variables..."

# Tạo file env.js trong thư mục /usr/share/nginx/html
echo "window._env_ = {" > /usr/share/nginx/html/env.js
for var in $(printenv | grep VITE_); do
  key=$(echo "$var" | cut -d '=' -f 1)
  value=$(echo "$var" | cut -d '=' -f 2-)
  echo "  $key: \"$value\"," >> /usr/share/nginx/html/env.js
done
echo "};" >> /usr/share/nginx/html/env.js
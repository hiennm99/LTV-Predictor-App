import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://d4a8-115-78-237-180.ngrok-free.app/api/v1",
  baseURL:"http://backend-fastapi:8000/api/v1",  
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

// ✅ Request Interceptor: Thêm token vào request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor: Xử lý lỗi 401 từ backend
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized, logging out...");
      localStorage.removeItem("access_token");
      localStorage.removeItem('userState'); 
      window.location.href = "/auth/signin"; // ⬅️ Redirect về trang đăng nhập
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

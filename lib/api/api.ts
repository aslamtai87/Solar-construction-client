import axios from "axios";
import { API_ENDPOINTS } from "./endPoints";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1",
    timeout:15000, // 15 seconds timeout
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})

export const apiPublic = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1",
    timeout:15000, // 15 seconds timeout
    headers: {
        "Content-Type": "application/json",
    },
})

api.interceptors.request.use(
    (config) => {
        console.log(' API Request:', config.method?.toUpperCase(), config.url);
    console.log('Sending Data:', config.data);
    return config;
    },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    console.log('Received Data:', response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 498 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        await api.post(API_ENDPOINTS.REFRESH_TOKEN);
        processQueue();
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
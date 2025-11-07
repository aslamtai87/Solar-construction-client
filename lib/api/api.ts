import axios from "axios";
import { API_ENDPOINTS } from "./endPoints";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1",
    headers: {
        "Content-Type": "application/json",
        "x-device-type": "web",
    },
    withCredentials: true,
})

export const apiPublic = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1",
    headers: {
        "Content-Type": "application/json",
        "x-device-type": "web",
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
let hasRedirected = false;

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

const handleAuthFailure = () => {  
  if (typeof window !== 'undefined' && !hasRedirected) {
    hasRedirected = true;
    const currentPath = window.location.pathname;
    
    // Don't redirect if already on signin or other auth pages
    if (currentPath === '/signin' || currentPath.startsWith('/signin')) {
      hasRedirected = false;
      return;
    }
    
    // Clear any auth-related data from localStorage
    try {
      localStorage.removeItem('auth-storage');
      localStorage.removeItem('user-storage');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
    
    const redirectUrl = currentPath !== '/signin' ? `?redirect=${encodeURIComponent(currentPath)}` : '';
    window.location.href = `/signin${redirectUrl}`;
    
    // Reset after redirect
    setTimeout(() => {
      hasRedirected = false;
    }, 1000);
  }
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Don't attempt token refresh on auth pages
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath.startsWith('/signin') || 
                        currentPath.startsWith('/signup') || 
                        currentPath.startsWith('/forgot-password') ||
                        currentPath.startsWith('/reset-password') ||
                        currentPath.startsWith('/verify-email');
      
      if (isAuthPage && error.response?.status === 498) {
        // Just reject the error without attempting refresh on auth pages
        return Promise.reject(error);
      }
    }
    
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
        const refreshResponse = await api.post(API_ENDPOINTS.REFRESH_TOKEN);
        if (refreshResponse.status === 200 || refreshResponse.status === 204) {
          processQueue();
          return api(originalRequest);
        } else {
          throw new Error('Unexpected refresh response');
        }
      } catch (refreshError: any) {
        if (refreshError.response) {
          const status = refreshError.response.status;
          if (status === 401 || status === 403) {
            processQueue(new Error('Session expired'));
            handleAuthFailure();
            return Promise.reject(refreshError);
          }
        }
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
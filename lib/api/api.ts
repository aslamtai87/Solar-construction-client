import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout:15000, // 15 seconds timeout
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})

export const apiPublic = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
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

export default api;
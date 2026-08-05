import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../constants";
import { storage } from "../utils/storage";

// create the axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// request interceptor — attach JWT token to every request automatically
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ error: string }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.error ?? "Something went wrong";

    // 401 — token expired or invalid — clear storage and redirect to login
    if (status === 401) {
      await storage.clearAll();
      // navigation to login handled by auth store listener
    }

    // attach a clean error message so handlers don't need to dig into axios error
    return Promise.reject({
      status,
      message,
    });
  }
);

export default api;
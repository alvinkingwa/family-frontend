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
    if (!config.headers.Authorization) {
      const token =
        (await storage.getToken()) ?? (await storage.getPreFamilyToken());
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const data = error.response?.data;

    let message = "Something went wrong";
    if (typeof data === "string" && data) message = data;
    else if (data?.error) message = data.error;
    else if (data?.message) message = data.message;
    else if (error.code === "ECONNABORTED")
      message = "Request timed out. The server may be waking up, try again.";
    else if (!error.response)
      message = "Cannot reach the server. Check your connection.";

    // 401 on a protected endpoint — token expired or invalid — clear storage.
    // Skip /auth/* so a failed login (e.g. "Email not verified") doesn't wipe storage.
    if (status === 401 && !error.config?.url?.startsWith("/auth/")) {
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
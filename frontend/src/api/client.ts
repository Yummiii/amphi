import axios from "axios";
import type { ApiResponse } from "../models/api";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    const apiResponse: ApiResponse = response.data;

    if (apiResponse.success) {
      response.data = apiResponse.data;
      return response;
    }

    const error = new Error(
      apiResponse.message || apiResponse.error || "API request failed",
    );
    return Promise.reject(error);
  },
  (error) => {
    return Promise.reject(error);
  },
);

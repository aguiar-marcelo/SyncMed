import axios from "axios";
import Cookies from "js-cookie";

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:8443";

export const axiosClient = axios.create({
  baseURL: apiBaseUrl+ "/api",
  headers: {
    "Content-Type": "application/json",
  },
});


axiosClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    const user = Cookies.get("user");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (user) {
      config.headers.UserId = `${JSON.parse(user || "").userId}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

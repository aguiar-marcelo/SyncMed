import axios from "axios";
import Cookies from "js-cookie";

export const apiBaseUrl = "https://localhost:32771";

export const axiosClient = axios.create({
  baseURL: apiBaseUrl + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});


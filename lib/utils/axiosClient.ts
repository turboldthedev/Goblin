import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token =
    Cookies.get("__Secure-next-auth.session-token") ||
    Cookies.get("next-auth.session-token");

  if (token) {
    // Set Authorization header
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("Frontend - No token found in cookies");
  }

  return config;
});

export default api;

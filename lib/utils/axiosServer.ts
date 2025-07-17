"use server";

import axios from "axios";
import { cookies } from "next/headers";

const apiServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiServer.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("__Secure-next-auth.session-token")?.value ||
    cookieStore.get("next-auth.session-token")?.value;

  if (token) {
    // Set Authorization header
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("Frontend - No token found in cookies");
  }

  return config;
});

export default apiServer;

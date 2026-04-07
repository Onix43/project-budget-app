import axios from "axios";
import { useUserStore } from "../store/useUserStore";

export const nextServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL + "/api",
  withCredentials: true,
});

nextServer.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        useUserStore.getState().clearIsAuthenticated();
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

import axios from "axios";
import type { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const uploadFile = async (url: string, formData: FormData) => {
  const { data } = await api.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export default api;

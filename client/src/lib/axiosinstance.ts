import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:  `${import.meta.env.VITE_URL}/api`,
  withCredentials: true,
});

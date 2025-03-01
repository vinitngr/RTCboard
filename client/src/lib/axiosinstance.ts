import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:  import.meta.env.VITE_NODE_ENV === 'development' ? 'http://localhost:3001/api' : `${import.meta.env.VITE_URL}/api`,
  withCredentials: true,
});

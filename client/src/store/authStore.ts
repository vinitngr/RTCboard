import { create } from "zustand";
import { axiosInstance } from "../lib/axiosinstance";
import { AuthStore } from "../types/types";
import { isAxiosError } from "axios";
import { useRoomStore } from "./roomStore";

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check-auth", { withCredentials: true });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { token, ...user } = res.data;
      set({ authUser: user });
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.log("User not authenticated.");
        } else {
          console.log("Axios error:", error.response?.data || error.message);
        }
      } else {
        console.log("Unexpected error:", error);
      }
      set({ authUser: null });
    }
  },


  handleLogin: async (formData) => {
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { token, ...user } = res.data;
      console.log(user);
      set({ authUser: user });
    } catch (error) {
      if (isAxiosError(error)) {
        if (Array.isArray(error.response?.data?.message)) {
          const validationErrors = error.response.data.message.map((err: { message: string }) => ({
            message: err.message
          }));
          console.log("Validation Errors:", validationErrors);
        } else if (typeof error.response?.data?.message === "string") {
          console.log("Validation Error:", error.response.data.message);
        } else {
          console.log("Axios Error:", error);
        }
      }
      set({ authUser: null });
    }
  },

  handleRegister: async (formData) => {
    try {
      const res = await axiosInstance.post("/auth/register", formData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { token, ...user } = res.data;
      set({ authUser: user });
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        console.error("Error in Register", error.response.data);
      } else {
        console.error("Error in Register:", (error as Error).message);
      }
      set({ authUser: null });
    }
  },

  handleLogout: async () => {
    try {
      useRoomStore.setState({
        socket: null,
        roomDetails: null,
        connection: null,
        canvasElements: [],
        meetings: [],
        docsElements: { title: "", elements: [] },
      });
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
    } catch (error) {
      console.error("Error in logout:", (error as Error).message);
    }
  }
}));

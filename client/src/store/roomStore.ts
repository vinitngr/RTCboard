import { create } from "zustand";
import { axiosInstance } from "../lib/axiosinstance";
import { useAuthStore } from "./authStore";
import { RoomStore } from "../types/types";
export const useRoomStore = create<RoomStore>((set) => ({
    roomDetails: null,
    createRoom: async (roomData) => {
        const userDetails : { userId : string | undefined , fullName : string | undefined } = {
            fullName : useAuthStore.getState().authUser?.fullName,
            userId : useAuthStore.getState().authUser?._id
        };
        try {
            const res = await axiosInstance.post("/room/create-room", {...roomData , userDetails });
            set({ roomDetails : res.data });
        } catch (error) {
            console.log("Error:", error);          
        }
    },
    joinRoom: async (joinRoomData) => {
        const userDetails : { userId : string | undefined , fullName : string | undefined } = {
            fullName : useAuthStore.getState().authUser?.fullName,
            userId : useAuthStore.getState().authUser?._id
        };

        try {
            const res = await axiosInstance.post("/room/join-room", { ...joinRoomData , userDetails});
            set({ roomDetails : res.data });
        } catch (error) {
            console.log("Error:", error);
        }
    },

    exitRoom: async (roomId: string) => {
        try {
            const res = await axiosInstance.post("/room/exit-room", { roomId });
            console.log(res.data);
            set({ roomDetails : null });
        } catch (error) {
            console.log("Error:", error);            
        }
    },


}))
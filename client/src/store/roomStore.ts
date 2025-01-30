import { create } from "zustand";
import { axiosInstance } from "../lib/axiosinstance";
import { useAuthStore } from "./authStore";
import { RoomStore } from "../types/types";
import { io } from "socket.io-client";
export const useRoomStore = create<RoomStore>((set , get) => ({
    socket: null,
    roomDetails: null,

    createRoom: async (roomData) => {
        const userDetails: { userId: string | undefined , fullName: string | undefined } = {
            fullName: useAuthStore.getState().authUser?.fullName,
            userId: useAuthStore.getState().authUser?._id
        };

        try {
            get().connectSocket();
            get().socket?.on('anotherUserJoined', (data) => {
               set({ roomDetails: data })
            });

            
            const res = await axiosInstance.post("/room/create-room", { ...roomData, userDetails });
            set({ roomDetails: res.data });

            return res.data?.roomId;
        } catch (error) {
            console.log("Error:", error);
        }
    },

    joinRoom: async (joinRoomData) => {
        const userDetails: { userId: string | undefined , fullName: string | undefined } = {
            fullName: useAuthStore.getState().authUser?.fullName,
            userId: useAuthStore.getState().authUser?._id
        };

        try {
            get().connectSocket();
            const res = await axiosInstance.post("/room/join-room", { ...joinRoomData, userDetails });
            get().socket?.emit('UserJoined', res.data);
            set({ roomDetails: res.data });

            return res.data?.roomId;
        } catch (error) {
            console.log("Error:", error);
        }
    },
    exitRoom: async (roomId) => {
        console.log(roomId);
        try {
            const res = await axiosInstance.delete(`/room/exit-room/${roomId}`);
            console.log(res.data);
            get().socket?.emit('userExited', {
                messageTo: get().roomDetails?.participants,
            });
            set({ roomDetails : null });
            get().disconnectSocket()
        } catch (error) {
            console.log("Error:", error);            
        }
    },

    connectSocket: () => {
        const { authUser } = useAuthStore.getState();
        if (!authUser || get().socket?.connected) return;

        const socket = io("http://localhost:3001/rtc", {
            query: {
                userId: authUser._id,
            },
        });

        socket.connect();


        get().socket?.on('userExitedBackend' , (data)=>{
            console.log('data from backend', data);
        })
        set({ socket: socket });
        get().socket?.emit('Test-message', 'connection Test');
    },

    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket?.emit('userDisconnected', {
                messageTo: get().roomDetails?.participants,
            });
            get().socket?.disconnect();
        }
    }
}));



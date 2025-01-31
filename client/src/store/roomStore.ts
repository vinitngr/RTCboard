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
            get().socket?.emit('joinSocketRoom' , joinRoomData.roomId);
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
        set({ socket: socket });

        
        get().socket?.on('userJoined' , (data)=>{
            get().socket?.emit('joinSocketRoom', data.roomId);
            set({roomDetails : data})
            window.onbeforeunload = () => { 
                get().socket?.emit('userDisconnected' , data.roomId);
            }
        })

        get().socket?.on('userExited' , (data : { userExited : boolean })=>{
            console.log('data from backend', data);
            if(data.userExited){
                set({roomDetails : null});
                window.location.reload();
            }
        })
    },

    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket?.disconnect();
        }
    }
}));



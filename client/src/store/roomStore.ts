import { create } from "zustand";
import { axiosInstance } from "../lib/axiosinstance";
import { useAuthStore } from "./authStore";
import { RoomStore } from "../types/types";
import { io } from "socket.io-client";
import { makeCall } from "../lib/rtc";
import { RTCcreateAnswer } from "../lib/rtc";
import { peerConnection } from "../lib/rtc";


export const useRoomStore = create<RoomStore>((set, get) => ({
    socket: null,
    roomDetails: null,

    createRoom: async (roomData) => {
        const userDetails: { userId: string | undefined , fullName: string | undefined } = {
            fullName: useAuthStore.getState().authUser?.fullName,
            userId: useAuthStore.getState().authUser?._id
        };
        try {
            get().connectSocket();
            const res = await axiosInstance.post("/room/create-room", { 
                ...roomData, 
                userDetails: userDetails
            });
            set({ roomDetails: res.data });
            return res.data?.roomId;
        } catch (error) {
            console.error("Error creating room:", error);
            throw error;
        }
    },

    joinRoom: async (joinRoomData) => {
        const userDetails: { userId: string | undefined , fullName: string | undefined } = {
            fullName: useAuthStore.getState().authUser?.fullName,
            userId: useAuthStore.getState().authUser?._id
        };
        try {
            if (!get().socket?.connected) get().connectSocket();
            const res = await axiosInstance.post("/room/join-room", { 
                ...joinRoomData, 
                userDetails: userDetails
            });
            get().socket?.emit('joinSocketRoom', joinRoomData.roomId);
            set({ roomDetails: res.data });
            get().createOffer(res.data.participants[0].userId);
            return res.data?.roomId;
        } catch (error) {
            console.error("Error joining room:", error);
            get().disconnectSocket();
            throw error;
        }
    },

    exitRoom: async (roomId) => {
        try {
            await axiosInstance.delete(`/room/exit-room/${roomId}`);
            get().disconnectSocket();
            // set({ roomDetails: null });
        } catch (error) {
            console.error("Error exiting room:", error);
        }
    },

    connectSocket: () => {
        const { authUser } = useAuthStore.getState();
        if (!authUser || get().socket?.connected) return;

        const socket = io("http://localhost:3001/rtc", {
            query: { userId: authUser._id },
            autoConnect: false
        });

        socket.connect();
        set({ socket });

        socket.on('connect_error', (err) => {
            console.error("Socket connection error:", err);
        });

        socket.on('userJoined', (data) => {
            socket.emit('joinSocketRoom', data.roomId);
            set({ roomDetails: data });
        });

        socket.on('userExited', (data) => {
            if (data.userExited) {
                set({ roomDetails: null });
                window.location.reload();
            }
        });

        socket.on('RTCoffer', (data: { offer: RTCSessionDescription }) => {
            get().createAnswer(data.offer);


        });
 
        socket.on('RTCanswer' ,async (data)=>{
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer.answer));
            // console.log(peerConnection.localDescription);
            // console.log(peerConnection.remoteDescription);
            console.log(peerConnection.connectionState);

        })

        socket.on('new-ice-candidate', async (data) => {
            if (data.ice && peerConnection.iceConnectionState !== 'connected' && peerConnection.iceConnectionState !== 'completed') {
                try {
                    await peerConnection.addIceCandidate(data.ice);
                } catch (error) {
                    console.error('Failed to add ICE candidate:', error);
                }
            }
        });
        
    },

    disconnectSocket: () => {
        try {
            if (get().socket?.connected) {
                get().socket?.disconnect();
                set({ socket: null });
            }
        } catch (error) {
            console.error("Error disconnecting socket:", error);
        }
    },

    createOffer: async (creatorId) => {
        try {
            const socket = get().socket;
            if (socket) await makeCall(socket, creatorId);
        } catch (error) {
            console.error("Error creating offer:", error);
        }
    },

    createAnswer: async (offer) => {
        try {
            const socket = get().socket!;
            await RTCcreateAnswer(offer, socket, get().roomDetails?.participants[1].userId);
            // console.log(peerConnection.localDescription);
            // console.log(peerConnection.remoteDescription);
        } catch (error) {
            console.error("Error creating answer:", error);
        }
    },
}));

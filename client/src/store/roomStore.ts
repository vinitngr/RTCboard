import { create } from "zustand";
import { axiosInstance } from "../lib/axiosinstance";
import { useAuthStore } from "./authStore";
import { RoomStore } from "../types/types";
import { io } from "socket.io-client";
import { RTCcreateAnswer , peerConnection , makeCall} from "../lib/rtc";


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
            get().socket?.emit('joinSocketRoom', userDetails.userId);
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
            //send offer to creator
            set({ roomDetails: res.data }); //user socket handling it optional
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
            // get().disconnectSocket();
            // set({ roomDetails: null });
            // window.location.reload();
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
            get().socket?.emit('joinSocketRoom', data.participants[0].userId);
            console.log('dat room details changing a');
            set({ roomDetails: data });
        });

        socket.on('userExited', (data) => {
            if (data.userExited) {
                get().disconnectSocket(); //optinal
                peerConnection.close() //optional 
                window.location.reload(); //reload as video steam
                set({ roomDetails: null }); //optional
            }
        });

        socket.on('RTCoffer', (data: { offer: RTCSessionDescription }) => {
            get().createAnswer(data.offer);
        });
 
        socket.on('RTCanswer' ,async (data)=>{
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer.answer));
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
            if (socket) {
                const offer = await makeCall(socket, creatorId);
                await peerConnection.setLocalDescription(offer);
                socket.emit('RTCoffer', { offer, creatorId });
            }
        } catch (error) {
            console.error("Error creating offer:", error);
        }
    },

    createAnswer: async (offer) => {
        try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const socket = get().socket!;
            const answer = await RTCcreateAnswer(socket , get().roomDetails?.participants[1].userId);
            await peerConnection.setLocalDescription(answer);
            
            socket.emit('RTCanswer' , {answer , joinerId : get().roomDetails?.participants[1].userId});
        } catch (error) {
            console.error("Error creating answer:", error);
        }
    },
}));

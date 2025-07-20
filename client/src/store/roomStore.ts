import { create } from "zustand";
import { axiosInstance } from "../lib/axiosinstance";
import { useAuthStore } from "./authStore";
import { RoomStore } from "../types/types";
import { io } from "socket.io-client";
import { PeerConnection } from "../lib/rtc";

export const useRoomStore = create<RoomStore>((set, get) => ({
    socket: null,
    roomDetails: null,
    connection: null,
    canvasElements: [],
    meetings: [],
    setCanvasElements: (canvasElements) => {
        set({ canvasElements });
    },
    docsElements: {
        title: '',
        elements: []
    },
    setDocsElements: (docsElements) => {
        set({ docsElements });
    },
    selectedMeetingData: null,

    createRoom: async (roomData) => {
        const userDetails: { userId: string | undefined, fullName: string | undefined } = {
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

            setTimeout(() => {
                if (get().roomDetails?.participants?.length !== 2) {
                    get().exitRoom(get().roomDetails!.roomId);
                }
            }, 1000 * 5 * 60);
            return res.data?.roomId;
        } catch (error) {
            console.error("Error creating room:", error);
            throw error;
        }
    },

    joinRoom: async (joinRoomData) => {
        const userDetails: { userId: string | undefined, fullName: string | undefined } = {
            fullName: useAuthStore.getState().authUser?.fullName,
            userId: useAuthStore.getState().authUser?._id
        };
        try {
            if (!get().socket?.connected) get().connectSocket();
            const res = await axiosInstance.post("/room/join-room", {
                ...joinRoomData,
                userDetails: userDetails
            });
            set({ roomDetails: res.data });
            console.log(get().roomDetails?.participants);
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
        } catch (error) {
            console.error("Error exiting room:", error);
        }
    },

    connectSocket: () => {
        const { authUser } = useAuthStore.getState();
        if (!authUser || get().socket?.connected) return;

        const backendURL = `${import.meta.env.VITE_URL}/rtc`;
        const socket = io(backendURL, {
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
            set({ roomDetails: data });
        });

        socket.on('userExited', (data) => {
            console.log(get().connection);
            if (data.userExited) {
                window.location.reload();
                get().disconnectSocket();
                set({ roomDetails: null });
                // get().connection?.dataChannel.close() // 
                // get().connection?.peerConnection.close()  //
            }
        });

        socket.on('RTCoffer', (data: { offer: RTCSessionDescription }) => {
            get().createAnswer(data.offer);
        });

        socket.on('RTCanswer', async (data) => {
            await get().connection?.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer.answer));

        })

        socket.on('new-ice-candidate', async (data) => {
            console.log(data);
            if (data.ice && get().connection?.peerConnection.iceConnectionState !== 'connected' && get().connection?.peerConnection.iceConnectionState !== 'completed') {
                try {
                    await get().connection?.peerConnection.addIceCandidate(data.ice);
                    console.log(get().connection?.peerConnection.iceConnectionState);
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
            if (!socket) return;

            if (!get().connection?.peerConnection) {
                const pcObj = PeerConnection().getInstance();

                pcObj.peerConnection.addTransceiver('video', { direction: 'sendrecv' });
                pcObj.peerConnection.addTransceiver('audio', { direction: 'sendrecv' });

                pcObj.peerConnection.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit("new-ice-candidate", {
                            ice: event.candidate,
                            id: get().roomDetails?.participants[0].userId,
                        });
                    }
                };

                set({ connection: pcObj });
            }

            const pc = get().connection!.peerConnection;

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket.emit("RTCoffer", { offer, creatorId });
        } catch (error) {
            console.error("Error creating offer:", error);
        }
    }
    ,

    createAnswer: async (offer) => {
        try {
            const socket = get().socket;
            if (!socket) return;

            if (!get().connection?.peerConnection) {
                set({ connection: PeerConnection().getInstance() });
            }
            get().connection!.peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit("new-ice-candidate", { ice: event.candidate, id: get().roomDetails?.participants[0].userId });
                }
            }
            await get().connection?.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await get().connection?.peerConnection.createAnswer();
            await get().connection?.peerConnection.setLocalDescription(answer);
            socket.emit('RTCanswer', { answer, joinerId: get().roomDetails?.participants[1].userId });
        } catch (error) {
            console.error("Error creating answer:", error);
        }
    },


    saveRoom: async () => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const docsData = get().docsElements.elements.map(({ ref, ...rest }) => rest);
            const roomData = {
                roomId: get().roomDetails?.roomId,
                roomName: get().roomDetails?.roomName,
                roomCreated: "2025-02-12T00:00:00.000Z",
                participants: get().roomDetails?.participants,
                Data: {
                    canvasData: JSON.stringify(get().canvasElements),
                    docsData: JSON.stringify({
                        title: get().docsElements.title, elements: docsData
                    })

                }
            }

            const res = await axiosInstance.post("/room/save-room", { roomData });
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }
    ,

    getMeetings: async () => {
        try {
            const res = await axiosInstance.get("/room/get-meetings");
            set({ meetings: res.data.meetings });
        } catch (error) {
            console.log(error);
        }
    },

    getMeetingData: async (roomId) => {
        try {
            const res = await axiosInstance.get(`/room/get-meeting-data/${roomId}`);
            set({ selectedMeetingData: res.data.meetingData });
            console.log(get().selectedMeetingData);
        } catch (error) {
            console.log(error);
        }
    }
}));

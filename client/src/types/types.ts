import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { Socket } from "socket.io-client";

interface AuthUser {
    _id: string;
    fullName: string;
    email: string;
    profilepic: string;
    createdAt: Date;
    role: string
}

export interface AuthStore {
    authUser: AuthUser | null;
    checkAuth: () => Promise<void>;
    handleLogin: (formData: { email: string; password: string }) => Promise<void>;
    handleRegister: (formData: { email: string; fullName: string; password: string }) => Promise<void>;
    handleLogout: () => Promise<void>;
}

export interface RoomStore {
    getMeetings: () => void;
    meetings: { roomId : string , roomName : string , roomCreated : string , participants : { role: string, fullName: string, userId: string }[] }[] | [];
    docsElements: { title: string, elements: Element[] };
    setDocsElements: (docsElement: { title: string, elements: Element[] }) => void;
    canvasElements: ExcalidrawElement[];
    setCanvasElements: (canvasElement: ExcalidrawElement[]) => void;
    connection: null | { peerConnection: RTCPeerConnection; dataChannel: RTCDataChannel };
    socket: null | Socket;
    roomDetails: null | { roomId: string; roomName: string; roomPassword: string; status: string; participants: { role: string, fullName: string, userId: string }[] };
    createRoom: (roomData: { roomName: string; roomPassword: string }) => Promise<void>;
    joinRoom: (joinRoomData: { roomId: string; roomPassword: string }) => Promise<void>;
    exitRoom: (roomId: string | undefined) => Promise<void>;
    connectSocket: () => void;
    // userInRoom : string[] ;
    disconnectSocket: () => void;
    createOffer: (creatorId: string) => void;
    createAnswer: (offer: RTCSessionDescription) => void;
    saveRoom: () => void;
}


export interface Element {
    color: string;
    id: number;
    tag: keyof JSX.IntrinsicElements;
    text: string;
    className?: string;
    ref?: React.LegacyRef<HTMLInputElement>;
}

export interface ToolbarButton {
    title?: string;
    tag?: keyof JSX.IntrinsicElements;
    icon?: JSX.Element;
    label?: string;
    className?: string;
    type?: 'divider' | 'spacer';
}

interface AuthUser {
    _id: string;
    fullName: string;
    email: string;
    profilepic : string;
    createdAt : Date
}
  
export interface AuthStore {
    authUser: AuthUser | null;
    checkAuth: () => Promise<void>;
    handleLogin: (formData: { email: string; password: string }) => Promise<void>;
    handleRegister: (formData: { email: string; fullName: string; password: string }) => Promise<void>;
    handleLogout: () => Promise<void>;
}

export interface RoomStore {
    roomDetails: null | { roomId: string; roomName: string; roomPassword: string; status: string; participants: { role: string , fullName: string, userId: string }[] };
    createRoom: (roomData: { roomName: string; roomPassword: string }) => Promise<void>;
    joinRoom: (joinRoomData: { roomId: string; roomPassword: string }) => Promise<void>;
    exitRoom: (roomId: string | undefined ) => Promise<void>;
}
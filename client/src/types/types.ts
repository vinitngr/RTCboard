interface AuthUser {
    id: string;
    name: string;
    email: string;
}
  
export interface AuthStore {
    authUser: AuthUser | null;
    checkAuth: () => Promise<void>;
    handleLogin: (formData: { email: string; password: string }) => Promise<void>;
    handleRegister: (formData: { email: string; fullName: string; password: string }) => Promise<void>;
    handleLogout: () => Promise<void>;
}
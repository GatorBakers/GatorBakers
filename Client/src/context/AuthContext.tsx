import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { logoutUser } from '../services/authService';

interface AuthContextType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const logout = useCallback(async () => {
        setAccessToken(null);
        await logoutUser().catch(() => {});
    }, []);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

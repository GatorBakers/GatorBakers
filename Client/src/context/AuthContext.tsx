import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { logoutUser } from '../services/authService';

interface AuthContextType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const logout = useCallback(async () => {
        setAccessToken(null);
        queryClient.removeQueries();
        await logoutUser().catch(() => {});
    }, [queryClient]);

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

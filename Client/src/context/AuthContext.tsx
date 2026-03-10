import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { logoutUser, refreshAccessToken } from '../services/authService';

interface AuthContextType {
    accessToken: string | null;
    isAuthLoading: boolean;
    setAccessToken: (token: string | null) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const queryClient = useQueryClient();
    const refreshCalled = useRef(false);
    
    useEffect(() => {
        if (refreshCalled.current) return;
        refreshCalled.current = true;

        refreshAccessToken()
            .then(({ access_token }) => setAccessToken(access_token))
            .catch(() => {})
            .finally(() => setIsAuthLoading(false));
    }, []);

    const logout = useCallback(async () => {
        setAccessToken(null);
        queryClient.removeQueries();
        await logoutUser().catch(() => {});
    }, [queryClient]);

    return (
        <AuthContext.Provider value={{ accessToken, isAuthLoading, setAccessToken, logout }}>
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

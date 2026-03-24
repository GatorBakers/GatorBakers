import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { logoutUser, refreshAccessToken } from '../services/authService';
import { queryKeys } from '../hooks/queryKeys';

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

    const clearAuthScopedQueries = useCallback(() => {
        queryClient.removeQueries({ queryKey: queryKeys.profileRoot });
        queryClient.removeQueries({ queryKey: queryKeys.myListingsRoot });
    }, [queryClient]);

    const updateAccessToken = useCallback((token: string | null) => {
        setAccessToken(prev => {
            const hasAuthBoundaryChanged = (!!prev && !token) || (!prev && !!token);
            if (hasAuthBoundaryChanged) {
                clearAuthScopedQueries();
            }
            return token;
        });
    }, [clearAuthScopedQueries]);
    
    useEffect(() => {
        if (refreshCalled.current) return;
        refreshCalled.current = true;

        refreshAccessToken()
            .then(({ access_token }) => updateAccessToken(access_token))
            .catch(() => {})
            .finally(() => setIsAuthLoading(false));
    }, [updateAccessToken]);

    const logout = useCallback(async () => {
        updateAccessToken(null);
        await logoutUser().catch(() => {});
    }, [updateAccessToken]);

    return (
        <AuthContext.Provider value={{ accessToken, isAuthLoading, setAccessToken: updateAccessToken, logout }}>
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

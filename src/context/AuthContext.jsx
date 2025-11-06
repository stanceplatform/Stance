import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import apiService from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user')) || null;
        } catch {
            return null;
        }
    });
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('authToken'));
    const [loading, setLoading] = useState(false);

    // === helpers ===
    const persistUser = (u) => {
        if (u) localStorage.setItem('user', JSON.stringify(u));
        else localStorage.removeItem('user');
        setUser(u || null);
    };

    const fetchMe = useCallback(async () => {
        if (!localStorage.getItem('authToken')) {
            persistUser(null);
            setIsAuthenticated(false);
            return null;
        }
        setLoading(true);
        try {
            const me = await apiService.getMe(); // GET /auth/me
            persistUser(me);
            setIsAuthenticated(true);
            return me;
        } catch (err) {
            persistUser(null);
            setIsAuthenticated(false);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async ({ usernameOrEmail, password }) => {
        try {
            // only persists tokens, not user
            await apiService.login({ usernameOrEmail, password });
            setIsAuthenticated(true);
            // now fetch the *real* user
            const me = await fetchMe();
            return me;
        } catch (error) {
            const errorMessage = error.data?.message || error.data?.error || error.message;
            throw new Error(errorMessage || 'Login failed. Please try again.');
        }
    }, [fetchMe]);

    const loginWithGoogle = useCallback(async ({ provider, code, email, name, profilePicture, providerId }) => {
        try {
            // only persists tokens, not user (same pattern as regular login)
            await apiService.oauth2Callback({ provider, code, email, name, profilePicture, providerId });
            setIsAuthenticated(true);
            // now fetch the *real* user
            const me = await fetchMe();
            return me;
        } catch (error) {
            const errorMessage = error.data?.message || error.data?.error || error.message;
            throw new Error(errorMessage || 'Google login failed. Please try again.');
        }
    }, [fetchMe]);

    const logout = useCallback(() => {
        apiService.logout(); // clears tokens + user
        setIsAuthenticated(false);
        persistUser(null);
    }, []);

    // NEW: use this after signup (or any time you receive fresh tokens)
    const authenticateWithTokens = useCallback(async ({ token, refreshToken }) => {
        if (token) apiService.setToken(token);
        if (refreshToken) apiService.setRefreshToken(refreshToken);
        setIsAuthenticated(true);
        const me = await fetchMe();  // hydrate user
        return me;
    }, [fetchMe]);

    // keep multiple tabs/windows in sync
    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === 'authToken' || e.key === 'user') {
                setIsAuthenticated(!!localStorage.getItem('authToken'));
                try {
                    setUser(JSON.parse(localStorage.getItem('user')) || null);
                } catch {
                    setUser(null);
                }
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    // react to 401/403 from ApiService
    useEffect(() => {
        apiService.onUnauthorized = logout;
        return () => {
            apiService.onUnauthorized = undefined;
        };
    }, [logout]);

    // on app load, hydrate from /auth/me if token exists
    useEffect(() => {
        if (localStorage.getItem('authToken')) {
            fetchMe();
        }
    }, [fetchMe]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, loginWithGoogle, logout, loading, fetchMe, authenticateWithTokens }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

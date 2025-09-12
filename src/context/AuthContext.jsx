import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import apiService from '../services/api'; // your default export instance

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // initialize from localStorage so refresh keeps the session
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('user')) || null; } catch { return null; }
    });
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('authToken'));
    const [loading, setLoading] = useState(false);

    // keep multiple tabs/windows in sync
    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === 'authToken' || e.key === 'user') {
                setIsAuthenticated(!!localStorage.getItem('authToken'));
                try { setUser(JSON.parse(localStorage.getItem('user')) || null); } catch { setUser(null); }
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const login = useCallback(async ({ usernameOrEmail, password }) => {
        setLoading(true);
        try {
            // apiService.login persists token/user to localStorage
            const data = await apiService.login({ usernameOrEmail, password });
            setIsAuthenticated(!!localStorage.getItem('authToken'));
            try { setUser(JSON.parse(localStorage.getItem('user')) || null); } catch { setUser(null); }
            return data;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        apiService.logout();                 // clears localStorage (authToken, refreshToken, user)
        setIsAuthenticated(false);
        setUser(null);
    }, []);

    // optional: react to 401s from ApiService
    useEffect(() => {
        apiService.onUnauthorized = logout;
        return () => { apiService.onUnauthorized = undefined; };
    }, [logout]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

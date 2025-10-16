// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();
    if (loading) {
        return <div className="text-center text-white">Checking session…</div>;
    }

    // If not authenticated, bounce to login (or "/") and remember where they were going
    if (!isAuthenticated) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }
    return children;
};

export default ProtectedRoute;

// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="text-center text-white">Checking session…</div>;
    }

    // If not authenticated, bounce to login (or "/") and remember where they were going
    if (!isAuthenticated) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    // If authenticated but collegeSelected is false or missing, redirect to select-college page
    // if (isAuthenticated && user && user.collegeSelected !== true) {
    //     return <Navigate to="/select-college" replace state={{ from: location }} />;
    // }

    return children;
};

export default ProtectedRoute;

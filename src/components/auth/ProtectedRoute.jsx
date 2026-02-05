// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();
    const { category } = useParams();

    if (loading) {
        return <div className="text-center text-white">Checking session…</div>;
    }

    // If not authenticated, bounce to login (or "/") and remember where they were going
    if (!isAuthenticated) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    // If authenticated but collegeSelected is false or missing, redirect to select-college page
    // Skip this redirect if we are on a category-specific route
    if (isAuthenticated && user && user.collegeSelected !== true && !category) {
        return <Navigate to="/select-college" replace state={{ from: location }} />;
    }

    return children;
};

export default ProtectedRoute;

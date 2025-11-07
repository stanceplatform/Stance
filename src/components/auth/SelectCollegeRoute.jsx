// src/components/auth/SelectCollegeRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Route guard for /select-college page
 * Allows access if:
 * - User is authenticated AND collegeSelected is false or missing
 * Redirects if:
 * - Not authenticated -> redirect to "/"
 * - Authenticated but collegeSelected is true -> redirect to "/dashboard"
 */
const SelectCollegeRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="text-center text-white">Checking session…</div>;
  }

  // If not authenticated, redirect to home
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If authenticated and collegeSelected is true, redirect to dashboard
  if (isAuthenticated && user && user.collegeSelected === true) {
    return <Navigate to="/dashboard" replace />;
  }

  // Allow access if authenticated and collegeSelected is false or missing
  return children;
};

export default SelectCollegeRoute;


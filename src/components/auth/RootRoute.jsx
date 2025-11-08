// src/components/auth/RootRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Route guard for root route "/"
 * - If authenticated and collegeSelected is false or missing, redirect to /select-college
 * - Otherwise, show Dashboard (which handles its own auth logic)
 */
const RootRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="text-center text-white">Checking session…</div>;
  }

  // If authenticated but collegeSelected is false or missing, redirect to select-college
  // if (isAuthenticated && user && user.collegeSelected !== true) {
  //   return <Navigate to="/select-college" replace />;
  // }

  // Otherwise, show the children (Dashboard)
  return children;
};

export default RootRoute;


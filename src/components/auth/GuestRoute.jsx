// src/components/auth/GuestRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // wait until AuthContext has finished initializing
  if (loading) {
    return <div className="text-center text-white">Checking session…</div>;
  }

  // already logged in -> go to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // not logged in -> show the page
  return children;
};

export default GuestRoute;

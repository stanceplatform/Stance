// src/components/auth/GuestRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GuestRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // wait until AuthContext has finished initializing
  if (loading) {
    return <div className="text-center text-white">Checking session…</div>;
  }

  // already logged in -> redirect based on collegeSelected status
  if (isAuthenticated) {
    // If collegeSelected is false or missing, redirect to select-college page
    if (user && user.collegeSelected !== true) {
      return <Navigate to="/select-college" replace />;
    }
    // Otherwise, go to home (dashboard)
    return <Navigate to="/" replace />;
  }

  // not logged in -> show the page
  return children;
};

export default GuestRoute;

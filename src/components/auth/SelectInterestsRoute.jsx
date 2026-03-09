// src/components/auth/SelectInterestsRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Route guard for /select-interests page
 * Allows access if:
 * - User is authenticated AND has no interest tags
 * Redirects if:
 * - Not authenticated -> redirect to "/"
 * - Authenticated but already has interest tags -> redirect to "/"
 */
const SelectInterestsRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="text-center text-white">Checking session…</div>;
  }

  // If not authenticated, redirect to home
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If authenticated and already has interest tags (or interestSelected is true), redirect home
  if (isAuthenticated && user && user.interestSelected === true) {
    return <Navigate to="/" replace />;
  }

  // Allow access if authenticated and no tags are selected
  return children;
};

export default SelectInterestsRoute;

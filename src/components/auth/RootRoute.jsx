// src/components/auth/RootRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Route guard for root route "/"
 * - If authenticated and collegeSelected is false or missing, redirect to /select-college
 * - Otherwise, show Dashboard (which handles its own auth logic)
 */
const RootRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="text-center text-white">Checking session…</div>;
  }

  // If authenticated but collegeSelected is false or missing, redirect to select-college
  // Preserve questionid in sessionStorage if it exists in URL
  if (isAuthenticated && user && user.collegeSelected !== true) {
    const questionid = new URLSearchParams(location.search).get('questionid');
    if (questionid) {
      sessionStorage.setItem('redirectQuestionId', questionid);
    }
    return <Navigate to="/select-college" replace />;
  }

  // Otherwise, show the children (Dashboard)
  return children;
};

export default RootRoute;


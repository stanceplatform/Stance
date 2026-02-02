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

  // Check if user has 'cricket' interest
  const isCricketUser = user?.tags?.some(t => t.tag_name === 'cricket');

  // If authenticated but collegeSelected is false or missing, redirect to select-college
  // Skips redirect if user is associated with cricket
  if (isAuthenticated && user && user.collegeSelected !== true && location.pathname === '/' && !isCricketUser) {
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


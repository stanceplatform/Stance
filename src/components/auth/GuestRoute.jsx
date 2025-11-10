// src/components/auth/GuestRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GuestRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // wait until AuthContext has finished initializing
  if (loading) {
    return <div className="text-center text-white">Checking session…</div>;
  }

  // already logged in -> redirect based on collegeSelected status
  if (isAuthenticated) {
    // Get questionid from URL or sessionStorage
    const questionid = new URLSearchParams(location.search).get('questionid') || sessionStorage.getItem('redirectQuestionId');
    
    // If collegeSelected is false or missing, redirect to select-college page
    if (user && user.collegeSelected !== true) {
      if (questionid) {
        sessionStorage.setItem('redirectQuestionId', questionid);
      }
      return <Navigate to="/select-college" replace />;
    }
    // Otherwise, go to home (dashboard) with questionid if it exists
    if (questionid) {
      sessionStorage.removeItem('redirectQuestionId');
      return <Navigate to={`/?questionid=${questionid}`} replace />;
    }
    return <Navigate to="/" replace />;
  }

  // not logged in -> show the page
  return children;
};

export default GuestRoute;

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
    // Otherwise, go to home (dashboard) or category page with questionid if it exists

    // Check if we are coming from a category route like /cricket/login
    // path parts: ["", "cricket", "login"]
    const pathParts = location.pathname.split('/');
    let redirectBase = '/';
    if (pathParts.length >= 3 && (pathParts[2] === 'auth' || pathParts[2] === 'login')) {
      redirectBase = `/${pathParts[1]}`;
    }

    if (questionid) {
      sessionStorage.removeItem('redirectQuestionId');
      return <Navigate to={`${redirectBase}?questionid=${questionid}`} replace />;
    }
    return <Navigate to={redirectBase} replace />;
  }

  // not logged in -> show the page
  return children;
};

export default GuestRoute;

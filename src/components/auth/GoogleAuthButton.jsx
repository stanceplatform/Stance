import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';
import { decodeJWT } from '../../utils/jwt';
import CollegeSelectionModal from './CollegeSelectionModal';

const GoogleAuthButton = ({ mode = 'signup', onError }) => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [pendingAuth, setPendingAuth] = useState(null);

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      // Decode the JWT credential to get user info
      const decoded = decodeJWT(credentialResponse.credential);

      if (!decoded) {
        throw new Error('Failed to decode Google credential');
      }

      // Extract user information from decoded JWT
      const email = decoded.email || '';
      const name = decoded.name || '';
      const profilePicture = decoded.picture || '';
      const providerId = decoded.sub || '';
      const code = credentialResponse.credential; // Using credential as code

      // Follow exact same pattern as regular login
      // loginWithGoogle will: call apiService.oauth2Callback (sets tokens), setIsAuthenticated(true), fetchMe()
      await loginWithGoogle({
        provider: 'google',
        code: code,
        email: email,
        name: name,
        profilePicture: profilePicture,
        providerId: providerId,
      });

      // COMMENTED OUT: College selection popup logic
      // Check if user needs to select college (first-time user)
      // Method 1: Check explicit flag from backend
      // Method 2: Check if collegeId is missing (null/undefined/empty)
      // Method 3: Fallback - fetch user data and check collegeId
      // let needsCollegeSelection = false;

      // if (response?.requiresCollegeSelection === true) {
      //   // Backend explicitly tells us
      //   needsCollegeSelection = true;
      // } else if (response?.collegeId === null || response?.collegeId === undefined || response?.collegeId === '') {
      //   // Backend returned empty collegeId
      //   needsCollegeSelection = true;
      // } else if (response?.token) {
      //   // Fallback: Fetch user data to check if collegeId exists
      //   try {
      //     // Temporarily set token to fetch user data
      //     apiService.setToken(response.token);
      //     const userData = await apiService.getMe();
      //     if (!userData?.collegeId || userData?.collegeId === null || userData?.collegeId === '') {
      //       needsCollegeSelection = true;
      //     }
      //   } catch (err) {
      //     console.error('Failed to fetch user data:', err);
      //     // If we can't check, assume it's a first-time user to be safe
      //     needsCollegeSelection = true;
      //   }
      // }

      // if (needsCollegeSelection && response?.token) {
      //   // Store auth data temporarily and show college selection modal
      //   setPendingAuth({
      //     token: response.token,
      //     refreshToken: response.refreshToken,
      //   });
      //   setShowCollegeModal(true);
      //   setLoading(false);
      //   return;
      // }

      // Navigate to dashboard (same as regular login)
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Google authentication error:', error);
      const errorMessage = error?.message || 'Google authentication failed. Please try again.';
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // COMMENTED OUT: College submission handler
  // const handleCollegeSubmit = async (collegeId) => {
  //   setLoading(true);
  //   try {
  //     // Update user's college
  //     await apiService.updateUserCollege(collegeId);

  //     // Now authenticate with the stored tokens
  //     if (pendingAuth) {
  //       await authenticateWithTokens({
  //         token: pendingAuth.token,
  //         refreshToken: pendingAuth.refreshToken,
  //       });
  //       setShowCollegeModal(false);
  //       setPendingAuth(null);
  //       navigate('/dashboard', { replace: true });
  //     }
  //   } catch (error) {
  //     console.error('Failed to update college:', error);
  //     const errorMessage = error?.data?.message || error?.message || 'Failed to update college. Please try again.';
  //     if (onError) {
  //       onError(errorMessage);
  //     }
  //     setShowCollegeModal(false);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleError = () => {
    const errorMessage = 'Google sign in was unsuccessful';
    if (onError) {
      onError(errorMessage);
    }
  };

  return (
    <>
      <div className="w-full max-w-[360px] mx-auto">
        <div className="[&>div]:w-full [&>div>div]:w-full [&>div>div]:rounded-[12px] [&>div>div]:shadow-sm">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            theme="outline"
            shape="rectangular"
            text={mode === 'signup' ? 'signup_with' : 'signin_with'}
            locale="en"
            width="100%"
            disabled={loading}
          />
        </div>
      </div>

      {/* COMMENTED OUT: College selection modal */}
      {/* <CollegeSelectionModal
        isOpen={showCollegeModal}
        onClose={() => {
          setShowCollegeModal(false);
          setPendingAuth(null);
        }}
        onSubmit={handleCollegeSubmit}
        loading={loading}
      /> */}
    </>
  );
};

export default GoogleAuthButton;


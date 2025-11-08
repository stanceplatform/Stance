import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { decodeJWT } from '../../utils/jwt';

const GoogleAuthButton = ({ mode = 'signup', onError }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  // Determine shape based on route
  const shape = location.pathname.includes('/login') ? 'rectangular' : 'pill';

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

      // Navigation will be handled by ProtectedRoute based on collegeSelected status
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

  const handleError = () => {
    const errorMessage = 'Google sign in was unsuccessful';
    if (onError) {
      onError(errorMessage);
    }
  };

  return (
    <>
      <div className="w-full max-w-[360px] mx-auto">
        <div className="google-btn [&>div]:w-full [&>div>div]:w-full mb-8">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap={false}
            theme="outline"
            shape={shape}
            text={mode === 'signup' ? 'signup_with' : 'signin_with'}
            locale="en"
            disabled={loading}
            width={360}
          />
        </div>
      </div>
    </>
  );
};

export default GoogleAuthButton;


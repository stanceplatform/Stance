import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';
import { decodeJWT } from '../../utils/jwt';

const GoogleAuthButton = ({ mode = 'signup', onError }) => {
  const navigate = useNavigate();
  const { authenticateWithTokens } = useAuth();
  const [loading, setLoading] = useState(false);

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

      // Call OAuth2 callback API
      const response = await apiService.oauth2Callback({
        provider: 'google',
        code: code,
        email: email,
        name: name,
        profilePicture: profilePicture,
        providerId: providerId,
      });

      // Authenticate with tokens
      if (response?.token) {
        await authenticateWithTokens({
          token: response.token,
          refreshToken: response.refreshToken,
        });
        navigate('/dashboard', { replace: true });
      } else {
        throw new Error('Authentication failed. No token received.');
      }
    } catch (error) {
      console.error('Google authentication error:', error);
      const errorMessage = error?.data?.message || error?.message || 'Google authentication failed. Please try again.';
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
  );
};

export default GoogleAuthButton;


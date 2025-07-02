import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from '../../config/google';

const GoogleSignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  const handleSuccess = async (credentialResponse) => {
    try {
      // Here you would typically send the credential to your backend
      // to verify and create/update the user session
      console.log('Google Sign In successful:', credentialResponse);
      
      // For now, we'll just set the user as authenticated
      login();
      navigate('/dashboard');
    } catch (error) {
      console.error('Google Sign In error:', error);
      setError('Sign in Failed, please try again');
    }
  };

  const handleError = () => {
    setError('Google Sign In was unsuccessful');
  };

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="flex items-center justify-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
          theme="filled_blue"
          shape="rectangular"
          text="signin_with"
          locale="en"
        />
      </div>
    </>
  );
};

export default GoogleSignIn;
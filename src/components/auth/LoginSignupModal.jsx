import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';

const LoginSignupModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { authenticateWithTokens } = useAuth();
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError(null);
      // Send the credential to backend for verification
      // Note: Update this endpoint if your backend uses a different path
      const response = await apiService.request('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      if (response?.token) {
        await authenticateWithTokens({
          token: response.token,
          refreshToken: response.refreshToken,
        });
        onClose();
      } else {
        setError('Sign in failed. Please try again.');
      }
    } catch (error) {
      console.error('Google Sign In error:', error);
      // If endpoint doesn't exist yet, show a helpful message
      if (error?.status === 404) {
        setError('Google sign in is not yet configured. Please use Sign up or Log in.');
      } else {
        setError(error?.data?.message || error?.message || 'Sign in failed. Please try again.');
      }
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign In was unsuccessful');
  };

  const handleSignupClick = () => {
    onClose();
    navigate('/auth');
  };

  const handleLoginClick = () => {
    onClose();
    navigate('/login');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main text */}
        <p className="text-center text-[#1B1B1B] text-base leading-6 mb-4">
          Log in or sign up to vote and see what others think.
        </p>

        {/* Terms & Conditions */}
        <p className="text-center text-[#1B1B1B] text-xs leading-4 mb-6">
          By continuing you agree to Stance's{' '}
          <Link
            to="/terms-conditions"
            className="underline text-[#9105C6]"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            Terms & Conditions
          </Link>
        </p>

        {/* Sign up with Google button */}
        <div className="mb-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            shape="rectangular"
            text="signup_with"
            locale="en"
            width="100%"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 text-center text-sm text-red-600">{error}</div>
        )}

        {/* SignUp | Log in links */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <button
            onClick={handleSignupClick}
            className="text-[#9105C6] underline font-medium"
          >
            SignUp
          </button>
          <span className="text-[#1B1B1B]">|</span>
          <button
            onClick={handleLoginClick}
            className="text-[#9105C6] underline font-medium"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupModal;


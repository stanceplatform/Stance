import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { decodeJWT } from '../../utils/jwt';

const LoginSignupModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);
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

      // Use the same loginWithGoogle function as GoogleAuthButton
      await loginWithGoogle({
        provider: 'google',
        code: code,
        email: email,
        name: name,
        profilePicture: profilePicture,
        providerId: providerId,
      });

      // Close modal and navigate home
      onClose();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Google Sign In error:', error);
      const errorMessage = error?.message || 'Sign in failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
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
            shape="pill"
            text="signup_with"
            locale="en"
            width={340}
            height={54}
            disabled={loading}
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


import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { decodeJWT } from '../../utils/jwt';
import { ALLOWED_CATEGORIES } from '../../utils/constants';
import mixpanel from '../../utils/mixpanel'; // Import Mixpanel

const LoginSignupModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Track "Open Signup form"
  React.useEffect(() => {
    if (isOpen) {
      mixpanel.trackEvent("Open Signup form");
    }
  }, [isOpen]);

  // Get questionid from URL query params
  const questionid = new URLSearchParams(location.search).get('questionid');

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

      // Close modal and navigate to /?questionid=XXX if questionid exists
      // Close modal and navigate
      onClose();

      // Check for category in current path (e.g. /cricket from /cricket/login or similar)
      const pathParts = location.pathname.split('/').filter(Boolean);
      // If we are on a category auth page like /cricket/auth or /cricket/login, the category is the first part
      // But if we are just on / (home), there is no category.
      // Actually, if we are in this modal, we might be on a public page or /auth.
      // Key: If we are on a category page (e.g. /cricket), we want to stay there.
      // If we are on /cricket/login, we want to go to /cricket.

      let redirectPath = '/';

      // Heuristic: if path starts with something other than auth/login/select-college, it might be a category.
      // Or if we are currently at /:category (which triggered the modal).
      // If we are at /cricket, location.pathname is /cricket.

      const currentPath = location.pathname;
      const isAuthPage = currentPath.includes('/auth') || currentPath.includes('/login');

      if (!isAuthPage && currentPath !== '/') {
        // Check if currentPath is a category page like /cricket
        const pathParts = currentPath.split('/').filter(Boolean);
        const potentialCategory = pathParts[0];
        if (potentialCategory && ALLOWED_CATEGORIES.includes(potentialCategory)) {
          redirectPath = currentPath;
        }
      } else if (isAuthPage) {
        // We are on /cricket/login or /login
        // Extract category from /:category/login
        const parts = currentPath.split('/');
        // parts ["", "cricket", "login"]
        if (parts.length >= 3) {
          const potentialCategory = parts[1];
          if (potentialCategory && ALLOWED_CATEGORIES.includes(potentialCategory)) {
            redirectPath = `/${potentialCategory}`;
          }
        }
      }

      // Get questionid from URL or sessionStorage
      const redirectQuestionId = questionid || sessionStorage.getItem('redirectQuestionId');

      if (redirectQuestionId) {
        sessionStorage.removeItem('redirectQuestionId');
        navigate(`${redirectPath}?questionid=${redirectQuestionId}`, { replace: true });
      } else {
        navigate(redirectPath, { replace: true });
      }
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
    // Track "Click on Signup (Simple)"
    mixpanel.trackEvent("Click on Signup (Simple)");

    onClose();
    if (questionid) {
      sessionStorage.setItem('redirectQuestionId', questionid);
    }
    const queryString = questionid ? `?questionid=${questionid}` : '';

    // Check if we are on a category page like /cricket
    const pathParts = location.pathname.split('/').filter(Boolean);
    const potentialCategory = pathParts[0];

    if (potentialCategory && ALLOWED_CATEGORIES.includes(potentialCategory)) {
      navigate(`/${potentialCategory}/auth${queryString}`);
    } else {
      navigate(`/auth${queryString}`);
    }
  };

  const handleLoginClick = () => {
    // Track "Click on Login" (from modal)
    mixpanel.trackEvent("Click on Login", { source: "modal" });

    onClose();
    if (questionid) {
      sessionStorage.setItem('redirectQuestionId', questionid);
    }
    const queryString = questionid ? `?questionid=${questionid}` : '';

    const pathParts = location.pathname.split('/').filter(Boolean);
    const potentialCategory = pathParts[0];

    if (potentialCategory && ALLOWED_CATEGORIES.includes(potentialCategory)) {
      navigate(`/${potentialCategory}/login${queryString}`);
    } else {
      navigate(`/login${queryString}`);
    }
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


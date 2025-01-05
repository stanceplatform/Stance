import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const GoogleSignIn = () => {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const { login } = useAuth(); // Get the login function from context
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    try {
      // Assuming you have a Google Sign In API set up and imported
      // For example, using Google Sign-In with Firebase
      // const provider = new firebase.auth.GoogleAuthProvider();
      // const result = await firebase.auth().signInWithPopup(provider);
      // console.log('Google Sign In successful:', result);
      console.log("login successful");
      // login(); // Call the login function to set the user as authenticated
      navigate('/dashboard'); // Use navigate to redirect to the dashboard
    } catch (error) {
      console.error('Google Sign In error:', error);
      setError('Sign in Failed, please try again');
    }
  };

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      <button
        onClick={handleSignIn}
        className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 rounded-md shadow-md hover:bg-gray-100 transition-colors duration-300"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google logo"
          className="w-5 h-5 mr-2"
        />
        Sign in with Google
      </button>
    </>
  );
};

export default GoogleSignIn;
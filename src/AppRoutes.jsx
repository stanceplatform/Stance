import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Card from './components/card/Card';
import NotificationsPage from './components/notification/NotificationPage';
import ThankYou from './components/thankyou/ThankYou';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import { GOOGLE_CLIENT_ID } from './config/google';

const AppRoutes = () => {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route
                            path="/dashboard"
                            element={
                                // <ProtectedRoute>
                                <Card />
                                // </ProtectedRoute>
                            }
                        />
                        <Route path="/notification" element={<NotificationsPage />} />
                        <Route path='/thankYou' element={<ThankYou />} />

                        {/* <Route path="/card" element={                                <Dashboard />} /> */}
                        {/* Add more routes here as needed */}
                    </Routes>
                </Router>
            </AuthProvider>
        </GoogleOAuthProvider>
    );
};

export default AppRoutes;

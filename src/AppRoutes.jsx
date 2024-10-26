import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './Landing';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component
import { AuthProvider } from './AuthContext';
import Card from './components/card/Card';
import NotificationsPage from './components/notification/NotificationPage';
import ThankYou from './components/thankyou/ThankYou';
const AppRoutes = () => {
    return (
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
    );
};

export default AppRoutes;

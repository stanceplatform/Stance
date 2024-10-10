import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './Landing';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component
import { AuthProvider } from './AuthContext';
import Card from './components/card/Card';
import NotificationsPage from './components/notification/NotificationPage';
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
                            <Card imageUrl="https://example.com/image.jpg" caption="Sample Caption" />
                            // </ProtectedRoute>
                        }
                    />
                                        <Route path="/notification" element={<NotificationsPage />} />

                    {/* <Route path="/card" element={                                <Dashboard />} /> */}
                    {/* Add more routes here as needed */}
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default AppRoutes;

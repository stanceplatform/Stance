import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './Landing';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component
import { AuthProvider } from './AuthContext';
import Dashboard from './components/Dashboard';
import Card from './components/card/Card';
const AppRoutes = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/card" element={<Card imageUrl="https://example.com/image.jpg" caption="Sample Caption" />} />
                    {/* Add more routes here as needed */}
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default AppRoutes;

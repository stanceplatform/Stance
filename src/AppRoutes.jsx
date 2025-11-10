import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Card from './components/card/Card';
import NotificationsPage from './components/notification/NotificationPage';
import ThankYou from './components/thankyou/ThankYou';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import { GOOGLE_CLIENT_ID } from './config/google';
import Login from './pages/Login';
import RequestInvite from './pages/RequestInvite';
import SendInvite from './pages/SendInvite';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute';
import ReportIssuePage from './pages/ReportIssuePage';
import NeedHelpPage from './pages/NeedHelpPage';
import CommunityGuidelinesPage from './pages/CommunityGuidelinesPage';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import SuggestQuestion from './pages/SuggestQuestion';
import ReportQuestion from './pages/ReportQuestion';
import Terms from './pages/Terms';
import SelectCollege from './pages/SelectCollege';
import SelectCollegeRoute from './components/auth/SelectCollegeRoute';
import RootRoute from './components/auth/RootRoute';
import NotFound from './pages/NotFound';

const AppRoutes = () => {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Root route - redirects to /select-college if authenticated but collegeSelected is false */}
                        <Route
                            path="/"
                            element={
                                <RootRoute>
                                    <Dashboard />
                                </RootRoute>
                            }
                        />

                        {/* Guest-only */}
                        <Route
                            path="/auth"
                            element={
                                <GuestRoute>
                                    <Landing />
                                </GuestRoute>
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                <GuestRoute>
                                    <Login />
                                </GuestRoute>
                            }
                        />
                        <Route
                            path="/request-invite"
                            element={
                                <GuestRoute>
                                    <RequestInvite />
                                </GuestRoute>
                            }
                        />
                        <Route
                            path="/signup"
                            element={
                                <GuestRoute>
                                    <Signup />
                                </GuestRoute>
                            }
                        />

                        {/* Select College - accessible when authenticated but collegeSelected is false */}
                        <Route
                            path="/select-college"
                            element={
                                <SelectCollegeRoute>
                                    <SelectCollege />
                                </SelectCollegeRoute>
                            }
                        />

                        {/* Auth-required */}
                        <Route
                            path="/send-invite"
                            element={
                                <ProtectedRoute>
                                    <SendInvite />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/notification"
                            element={
                                <ProtectedRoute>
                                    <NotificationsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/report"
                            element={
                                <ProtectedRoute>
                                    <ReportQuestion />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/suggestquestion"
                            element={
                                <ProtectedRoute>
                                    <SuggestQuestion />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/help"
                            element={
                                <ProtectedRoute>
                                    <NeedHelpPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Public */}
                        <Route
                            path="/guidelines"
                            element={<CommunityGuidelinesPage />}
                        />
                        <Route
                            path="/terms-conditions"
                            element={<Terms />}
                        />
                        <Route
                            path="/forgot-password"
                            element={
                                <GuestRoute>
                                    <ForgotPassword />
                                </GuestRoute>
                            }
                        />
                        <Route
                            path="/reset-password"
                            element={
                                <GuestRoute>
                                    <ResetPassword />
                                </GuestRoute>
                            }
                        />
                        <Route
                            path="*"
                            element={<NotFound />}
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </GoogleOAuthProvider>
    );
};

export default AppRoutes;

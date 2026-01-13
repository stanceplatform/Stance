// pages/Landing.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthShell from '../components/layouts/AuthShell';
import Logo from '../components/ui/Logo';
import CTAButton from '../components/ui/CTAButton';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
import bg from '../assets/bg.svg';
import { ALLOWED_CATEGORIES } from '../utils/constants';

const Landing = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState('');

    // Handle back button: if no history, redirect to '/'
    const handleBack = () => {
        // In React Router v6, location.key === "default" means first entry (no history)
        if (location.key === 'default') {
            navigate('/', { replace: true });
        } else {
            navigate(-1);
        }
    };

    return (
        <AuthShell
            bgImage={bg}
            showBack
            onBack={handleBack}
            footer={
                <div className="py-3 max-w-[300px] mx-auto">
                    <p className="text-center font-inter text-[13px] font-normal leading-[16px] text-[#E9B4FD]">
                        By proceeding, I agree to Stance's{' '}
                        <br />
                        <Link to="/terms-conditions" className="underline">
                            Terms & Conditions
                        </Link>
                        .
                    </p>
                </div>
            }
        >
            {/* Logo */}
            <div className="mb-6">
                <Logo />
            </div>

            {/* Headline */}
            <h1 className="text-center font-intro text-[36px] leading-[48px] font-[600] text-[#F0E224]">
                Safe space for your opinions
            </h1>

            {/* CTAs */}
            <div className="mt-10 w-full space-y-3">
                <div className="mb-5">
                    <Link
                        to={() => {
                            const pathParts = location.pathname.split('/').filter(Boolean);
                            const category = pathParts[0];
                            if (category && ALLOWED_CATEGORIES.includes(category)) {
                                return `/${category}/login`
                            }
                            return "/login";
                        }}
                        className="no-underline"
                    >
                        <CTAButton
                            as="div"
                            variant="primary"
                        >
                            <span className="font-inter font-[500] text-[18px] leading-[32px] tracking-[0.88px] text-[#5B037C]">
                                Login
                            </span>
                        </CTAButton>
                    </Link>
                </div>

                {/* Google Sign up button */}
                <div className="mb-5">
                    <GoogleAuthButton mode="signup" onError={setError} />
                </div>

                {/* Show Sign up button only if on the main /auth route (no category) */}
                {location.pathname === '/auth' && (
                    <div>
                        <Link to="/request-invite" className="no-underline">
                            <CTAButton
                                as="div"
                                variant="secondary"
                            >
                                <span className="font-inter font-[500] text-[18px] leading-[32px] tracking-[0.88px] text-white">
                                    Sign up
                                </span>
                            </CTAButton>
                        </Link>
                    </div>
                )}

                <div className="pt-1 text-center">
                    <Link
                        to="/forgot-password"
                        onClick={() => {
                            // Track "Click on Forget Password"
                            import('../utils/mixpanel').then(({ default: mixpanel }) => {
                                mixpanel.trackEvent("Click on Forget Password");
                            });
                        }}
                        className="font-inter text-[16px] leading-[24px] text-white hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>

                {error && (
                    <div className="mt-3 text-center text-[14px] text-red-200">
                        {error}
                    </div>
                )}
            </div>
        </AuthShell>
    );
};

export default Landing;

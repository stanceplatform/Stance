// pages/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import AuthShell from '../components/layouts/AuthShell';
import Logo from '../components/ui/Logo';
import CTAButton from '../components/ui/CTAButton';
import bg from '../assets/bg.svg';

const Landing = () => {
    return (
        <AuthShell
            bgImage={bg}
            footer={
                <div className="py-3 max-w-[300px] mx-auto">
                    <p className="text-center text-[13px] leading-[16px] text-[#E9B4FD]">
                        By proceeding, I agree to Stance’s{' '}
                        <Link to="/privacy" className="underline">
                            Privacy Statement
                        </Link>{' '}
                        and{' '}
                        <Link to="/terms" className="underline">
                            Terms of Service
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
                Safe space for your<br />opinions
            </h1>

            {/* CTAs */}
            <div className="mt-6 w-full space-y-3">
                <div className="mb-5">
                    <Link to="/login" className="no-underline">
                        <CTAButton
                            as="div"
                            variant="primary"
                        >
                            <span className="font-intro font-[500] text-[22px] leading-[32px] tracking-[0.88px]">
                                Login
                            </span>
                        </CTAButton>
                    </Link>
                </div>

                <div>
                    <Link to="/request-invite" className="no-underline">
                        <CTAButton
                            as="div"
                            variant="secondary"
                        >
                            <span className="font-intro font-[500] text-[22px] leading-[32px] tracking-[0.88px]">
                                Request Invite
                            </span>
                        </CTAButton>
                    </Link>
                </div>

                <div className="pt-1 text-center">
                    <Link
                        to="/forgot-password"
                        className="text-[16px] leading-[24px] text-white/90 hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>
            </div>
        </AuthShell>
    );
};

export default Landing;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthShell from '../components/layouts/AuthShell';
import CTAButton from '../components/ui/CTAButton';
import Logo from '../components/ui/Logo';
import { useAuth } from '../context/AuthContext';
import bg from '../assets/bg.svg';

const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/auth', { replace: true });
    }
  };

  const handleContact = () => {
    if (isAuthenticated) {
      navigate('/help');
    } else {
      navigate('/request-invite');
    }
  };

  return (
    <AuthShell bgImage={bg}>
      <div className="flex w-full max-w-[360px] flex-col items-center text-center text-white gap-8">
        <Logo />

        <div className="flex flex-col gap-4">
          <div className="rounded-[28px] border-2 border-dashed border-white/70 bg-white/10 px-8 py-2 shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
            <span className="font-intro text-[40px] leading-[48px] tracking-[6px] text-[#F0E224]">404</span>
          </div>
          <p className="font-inter text-[18px] leading-[28px] text-white/80">
            The page you’re looking for does not exist.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <CTAButton onClick={handleGoHome}>
            {isAuthenticated ? 'Go to dashboard' : 'Back to login'}
          </CTAButton>
        </div>
      </div>
    </AuthShell>
  );
};

export default NotFound;


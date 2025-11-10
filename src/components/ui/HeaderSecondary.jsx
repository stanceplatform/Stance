import React from 'react'
import { useNavigate } from 'react-router-dom';

const HeaderSecondary = ({ onBack }) => {
  const navigate = useNavigate();

  // your existing page logic
  const defaultBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
    } else {
      defaultBack();
    }
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 max-w-[480px] mx-auto">
      <div className="bg-[#9105C6] flex items-center px-4 py-5">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Go back"
          className="mr-3 p-2 -ml-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.5001 12.8999H5.17583L10.0043 17.7299L8.73008 19.0056L1.72583 11.9999L8.73008 4.99414L10.0043 6.26989L5.17583 11.0999H22.5001V12.8999Z" fill="#F0E224" />
          </svg>
        </button>
        <div className="">
          <img
            loading="lazy"
            src="/logo-sm.svg"
            alt="Logo"
            className="object-contain z-20 shrink-0 self-stretch my-auto aspect-auto w-[98px]"
          />
        </div>
      </div>
    </div>
  )
}

export default HeaderSecondary
// pages/RequestInvite.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthShell from '../components/layouts/AuthShell';
import Logo from '../components/ui/Logo';
import CTAButton from '../components/ui/CTAButton';
import apiService from '../services/api';
import TextField from '../components/ui/TextField';
import bg from '../assets/bg.svg';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RequestInvite = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(''); // when truthy, we show the centered screen

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setOk('');

    if (!email || !emailRegex.test(email)) {
      setErr('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      const res = await apiService.requestInvite(email);
      if (res?.success) {
        setOk(res?.message || "You've been added to the waitlist. We'll notify you by email within 48 hours if your request is approved. Please keep an eye on your inbox.");
        setEmail('');
      } else {
        setErr(res?.message || 'Unable to submit request.');
      }
    } catch (error) {
      setErr(error.data?.message || error.data?.error || error.message || 'Request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Footer is shown only when the form is visible
  const footerWhenForm =
    !ok ? (
      <div className="px-6">
        <div className="flex justify-center">
          <button
            type="submit"
            form="inviteForm"
            disabled={loading}
            className="mx-auto w-[320px] max-w-full mb-5"
          >
            <CTAButton as="div" variant="secondary"
              icon={
                <svg width="24" height="19" viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.3258 18.686V19.0002H15.5258V18.686C15.5258 13.3445 15.5258 13.2545 9.00003 13.2545C2.47578 13.2545 2.47578 13.2545 2.47578 19.0002H0.675781C0.675781 12.2202 1.50003 11.5002 9.00003 11.5002C16.0658 11.5002 17.31 11.9802 17.3258 18.686ZM4.57578 4.9902C4.56453 4.87095 4.55778 4.7322 4.55778 4.5927C4.55778 2.1657 6.48078 0.187953 8.88603 0.100203H8.89428C8.95578 0.0972032 9.02778 0.0957031 9.10053 0.0957031C10.2743 0.0957031 11.3393 0.560703 12.1215 1.31595L12.12 1.31445C12.9548 2.14995 13.4783 3.2967 13.5 4.5657V4.5702C13.5068 4.6617 13.5105 4.76895 13.5105 4.87695C13.5105 6.1797 12.9728 7.3572 12.1073 8.19945L12.1065 8.2002C11.3258 8.9472 10.2735 9.41595 9.11178 9.44445H9.10653H9.00078C8.97753 9.4452 8.94978 9.4452 8.92278 9.4452C6.52203 9.4452 4.57503 7.49895 4.57503 5.09745C4.57503 5.05995 4.57578 5.0217 4.57653 4.9842V4.98945L4.57578 4.9902ZM6.37578 4.9902C6.37278 5.0367 6.37128 5.0907 6.37128 5.14545C6.37128 5.8317 6.64728 6.4527 7.09503 6.9042C7.59528 7.41195 8.28903 7.68045 9.00078 7.64445C9.70503 7.6362 10.3425 7.35795 10.8165 6.9087L10.815 6.9102C11.3933 6.2982 11.6775 5.46795 11.595 4.6302C11.595 4.61895 11.595 4.6062 11.595 4.5927C11.595 3.81495 11.2995 3.10545 10.8135 2.5722L10.8158 2.57445C10.368 2.1552 9.76503 1.89795 9.10128 1.89795C9.06603 1.89795 9.03003 1.8987 8.99478 1.9002H9.00003C8.99628 1.9002 8.99253 1.9002 8.98803 1.9002C7.52928 1.9002 6.34653 3.08295 6.34653 4.5417C6.34653 4.67895 6.35703 4.81395 6.37728 4.9452L6.37578 4.9302V4.9902ZM24 7.6002H20.4V4.0002H18.6V7.6002H15V9.4002H18.6V13.0002H20.4V9.4002H24V7.6002Z" fill="white" />
                </svg>
              }
            >
              <span className="font-intro font-[500] text-[22px] leading-[32px] tracking-[0.88px]">
                {loading ? 'Requesting…' : 'Request Invite'}
              </span>
            </CTAButton>
          </button>
        </div>
      </div>
    ) : null;

  return (
    <AuthShell
      bgImage={bg}
      showBack
      onBack={() => navigate(-1)}
      footer={footerWhenForm}
    >
      {/* Logo stays on both states */}
      <div className="mb-6">
        <Logo />
      </div>

      {/* FORM (default) */}
      {!ok && (
        <form id="inviteForm" onSubmit={submit} className="w-full max-w-[360px] pb-20">
          <TextField
            id="inviteEmail"
            label="Email"
            name="inviteEmail"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Enter student email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={err}
          />
          {/* {err ? <div className="mt-3 text-center text-[13px] text-red-200">{err}</div> : null} */}
        </form>
      )}

      {/* SUCCESS SCREEN (centered copy + keep logo) */}
      {ok && (
        <div
          className="w-full max-w-[360px]"
          aria-live="polite"
        >
          <p className="px-2 text-[16px] leading-7 text-white/90">
            {ok}
          </p>
        </div>
      )}
    </AuthShell>
  );
};

export default RequestInvite;

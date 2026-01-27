// pages/RequestInvite.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthShell from '../components/layouts/AuthShell';
import Logo from '../components/ui/Logo';
import CTAButton from '../components/ui/CTAButton';
import apiService from '../services/api';
import TextField from '../components/ui/TextField';
import bg from '../assets/bg.svg';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RequestInvite = () => {
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const isCricket = state?.from?.includes('/cricket') || pathname.includes('/cricket');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(''); // when truthy, we show the centered screen
  const [submittedEmail, setSubmittedEmail] = useState('');

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
      // Track "Click on Send Verification Link"
      import('../utils/mixpanel').then(({ default: mixpanel }) => {
        mixpanel.trackEvent("Click on Send Verification Link");
      });

      const res = await apiService.requestInvite(email);
      if (res?.success) {
        setOk(res?.message || "You've been added to the waitlist. We'll notify you by email within 48 hours if your request is approved. Please keep an eye on your inbox.");
        setSubmittedEmail(email);
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
            <CTAButton as="div" variant="secondary">
              <span className="font-inter font-[500] text-[18px] leading-[32px] tracking-[0.88px]">
                {loading ? 'Sending…' : 'Send Verification Link'}
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
            placeholder={isCricket ? "Enter email id" : "Enter student email"}
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
          {isCricket ? (
            <div className="px-2 text-center font-inter">
              <p className="text-[24px] font-[600] text-[#F0E224] mb-2">Welcome!</p>
              <div className="text-[16px] leading-[24px] text-white mb-6">
                <p>We’ve sent a sign-up link to</p>
                <p className="font-[600]">{submittedEmail}</p>
                <p className="mt-1">Check your inbox to complete your registration.</p>
              </div>
              <p className="text-[13px] leading-[20px] text-white/70">
                Didn’t receive it? Check your Spam or Promotions folder.
              </p>
            </div>
          ) : (
            <p className="px-2 text-[16px] leading-7 text-white/90">
              {ok}
            </p>
          )}
        </div>
      )}
    </AuthShell>
  );
};

export default RequestInvite;

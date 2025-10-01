// pages/SendInvite.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthShell from '../components/layouts/AuthShell';
import Logo from '../components/ui/Logo';
import CTAButton from '../components/ui/CTAButton';
import apiService from '../services/api';
import TextField from '../components/ui/TextField';
import bg from '../assets/bg.svg';
import { getApiErrorMessage } from '../utils/apiError';
import toast from 'react-hot-toast';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // light validation

const SendInvite = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [invitesLeft, setInvitesLeft] = useState(2);

  // Fetch remaining invite quota
  useEffect(() => {
    let ignore = false;
    (async () => {
      const res = await apiService.getInviteQuota();
      if (!ignore) setInvitesLeft(res.remaining);
    })();
    return () => { ignore = true; };
  }, []);


  const submit = async (e) => {
    if (e) e.preventDefault();
    setErr('');
    setOk('');

    if (!email || !emailRegex.test(email)) {
      setErr('Please enter a valid student email.');
      return;
    }
    if (invitesLeft !== null && invitesLeft <= 0) {
      setErr('You have no invites left.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.sendInvite(email);
      if (res?.success) {
        setOk(res?.message || 'Invite sent!');
        setEmail('');
        setInvitesLeft((n) => (typeof n === 'number' ? Math.max(0, n - 1) : n));
      } else {
        setErr(res?.message || 'Unable to send invite.');
      }
    } catch (error) {
      // Handle the enhanced error object
      if (error.status && error.data) {
        // Use the backend's error message if available
        const errorMessage = error.data.message || error.data.error || error.message;
        setErr(errorMessage || 'Invite failed. Please try again.');
        toast.error(getApiErrorMessage(error));
        // You can also access the status code if needed
        console.error('API Error Status:', error.status);
      } else {
        // Fallback for non-API errors
        setErr(error?.message || 'Invite failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      bgImage={bg}
      showBack
      onBack={() => navigate(-1)}
      footer={
        <div className="px-6">
          <div className="flex justify-center">
            <button
              type="submit"
              form="sendInviteForm"
              disabled={loading}
              // big rounded pill like Figma button, width ~320
              className="mx-auto w-[320px] max-w-full mb-5"
            >
              {/* If your CTAButton `secondary` is yellow, keep it.
                 Otherwise swap to the variant that renders the yellow pill. */}
              <CTAButton
                as="div"
                variant="primary"
              >
                {/* Figma-like button text sizing */}
                <span className="font-inter font-[500] text-[18px] leading-[32px] tracking-[0.5px]">
                  {loading ? 'Inviting…' : 'Send Invite'}
                </span>
              </CTAButton>
            </button>
          </div>
        </div>
      }
    >

      {/* Figma heading: Intro, 36/48, yellow-300, left aligned */}
      <div className="w-full max-w-[360px] mb-4">
        <p className="font-intro font-[600] text-[36px] leading-[48px] text-[#F5EC70] text-left">
          Who in your college deserves a spot on Stance? Invite them now.
        </p>
      </div>

      {/* Form */}
      <form id="sendInviteForm" onSubmit={submit} className="w-full max-w-[360px] pb-16 mt-2">
        <TextField
          id="studentInviteEmail"
          label="Email"
          name="studentInviteEmail"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Enter student email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={err}
        />

        {/* “invites remaining” copy (matches figma placement) */}
        <div className="mt-3 text-center">
          <span className="text-white font-intro text-[16px] leading-[24px]">
            {invitesLeft !== null ? `${invitesLeft} invites remaining` : ''}
          </span>
        </div>

        {/* Messages */}
        {/* {err ? <div className="mt-3 text-center text-[13px] text-red-200">{err}</div> : null} */}
        {ok ? <div className="mt-3 text-center text-[13px] text-green-200">{ok}</div> : null}
      </form>
    </AuthShell>
  );
};

export default SendInvite;

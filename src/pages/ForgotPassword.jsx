// pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthShell from '../components/layouts/AuthShell';
import Logo from '../components/ui/Logo';
import CTAButton from '../components/ui/CTAButton';
import TextField from '../components/ui/TextField';
import bg from '../assets/bg.svg';
import apiService from '../services/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const handleSend = async () => {
    if (!email.trim()) {
      setErr('Please enter your registered email');
      return;
    }
    setErr(''); setMsg('');
    setLoading(true);
    try {
      const res = await apiService.forgotPassword(email.trim());
      setMsg(res?.message || 'A password reset link has been sent to your email.');
    } catch (e) {
      console.error('ForgotPassword error', e);
      const status = e?.message?.includes('404') ? 404 : e?.response?.status;
      if (status === 404) {
        setErr('This email ID is not registered.');
      } else {
        setErr('Failed to send reset link. Try again.');
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
            <button type="button"
              onClick={handleSend}
              disabled={loading}
              className='mx-auto w-[320px] max-w-full mb-5"'
            >
              <CTAButton
                as="div"
                variant="primary"
              >
                <span className="font-intro font-[500] text-[22px] leading-[32px] tracking-[0.88px]">
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </span>
              </CTAButton>
            </button>
          </div>
        </div>
      }
    >
      <div className="mb-6"><Logo /></div>

      <div className="w-full max-w-[360px] pb-20">
        <TextField
          id="email"
          label="Enter your registered email ID"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="john@college.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={err && !msg ? err : ''}
        />
        {msg ? <div className="mt-2 text-center text-[14px] text-green-200">{msg}</div> : null}
        {/* {err && !msg ? <div className="mt-2 text-center text-[14px] text-red-200">{err}</div> : null} */}
      </div>
    </AuthShell>
  );
}

// pages/ResetPassword.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthShell from '../components/layouts/AuthShell';
import Logo from '../components/ui/Logo';
import CTAButton from '../components/ui/CTAButton';
import TextField from '../components/ui/TextField';
import bg from '../assets/bg.svg';
import apiService from '../services/api';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const query = useQuery();
  const token = query.get('token') || '';
  const [pw, setPw] = useState('');
  const [cpw, setCpw] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const validate = () => {
    if (!token) return 'Invalid or missing token.';
    if (pw.length < 6) return 'Password must be at least 6 characters.';
    if (pw !== cpw) return 'Passwords do not match.';
    return '';
  };

  const handleReset = async () => {
    const v = validate();
    if (v) { setErr(v); setMsg(''); return; }
    setLoading(true); setErr(''); setMsg('');
    try {
      const res = await apiService.resetPassword(token, pw);
      setMsg(res?.message || 'Password updated successfully.');
      // Determine redirect path
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      const isCricket = pathParts[0] === 'cricket' || pathParts.includes('cricket');
      const loginPath = isCricket ? '/cricket/login' : '/login';
      setTimeout(() => navigate(loginPath, { replace: true }), 1500);
    } catch (error) {
      setErr(error.data?.message || error.data?.error || error.message || 'Failed to reset password. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const isCricket = pathParts[0] === 'cricket' || pathParts.includes('cricket');
  const forgotPath = isCricket ? '/cricket/forgot-password' : '/forgot-password';

  return (
    <AuthShell
      bgImage={bg}
      showBack
      onBack={() => navigate(-1)}
      footer={
        <div className="px-6">
          <div className="flex justify-center">
            <CTAButton
              type="button"
              onClick={handleReset}
              disabled={loading}
            >
              {loading ? 'Updating…' : 'Set New Password'}
            </CTAButton>
          </div>
        </div>
      }
    >
      <div className="mb-6"><Logo /></div>

      {!token ? (
        <div className="w-full max-w-[360px] pb-20">
          <p className="text-white/90 text-[15px]">
            Reset token is missing or invalid. Go back to{' '}
            <Link to={forgotPath} className="underline">Forgot Password</Link>.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-[360px] pb-20">
          <div className="mb-4">
            <TextField
              id="newPassword"
              label="New Password"
              name="newPassword"
              type="password"
              togglePassword
              autoComplete="new-password"
              placeholder="Enter new password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </div>

          <TextField
            id="confirmPassword"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            togglePassword
            autoComplete="new-password"
            placeholder="Re-enter new password"
            value={cpw}
            onChange={(e) => setCpw(e.target.value)}
            error={err ? err : ''}
          />

          {msg ? <div className="mt-2 text-center text-[14px] text-green-200">{msg}</div> : null}
          {/* {err && !msg ? <div className="mt-2 text-center text-[14px] text-red-200">{err}</div> : null} */}
        </div>
      )}
    </AuthShell>
  );
}

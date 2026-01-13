// pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import AuthShell from '../components/layouts/AuthShell';
import Logo from '../components/ui/Logo';
import CTAButton from '../components/ui/CTAButton';
import TextField from '../components/ui/TextField';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
import bg from '../assets/bg.svg';
import { useAuth } from '../context/AuthContext';
import analytics from '../utils/analytics';

import mixpanel from '../utils/mixpanel'; // Import Mixpanel

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [err, setErr] = useState('');
  const { login, loading } = useAuth();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!form.usernameOrEmail || !form.password) {
      setErr('Please enter email and password.');
      return;
    }

    // Track "Click on Submit Login Button"
    mixpanel.trackEvent("Click on Submit Login Button");

    analytics.trackEvent('Auth', 'Login Attempt');
    try {
      await login(form);

      // Track Success in Mixpanel is implied by "App Opened" on reload or we can add explicit "Login Success" if requested.
      // But for now, user requested "Click on Submit Login Button".

      analytics.trackEvent('Auth', 'Login Success');
      // Get questionid from URL query params or sessionStorage and redirect to /?questionid=XXX
      const questionid = searchParams.get('questionid') || sessionStorage.getItem('redirectQuestionId');

      // Check if we are on a category login page: /:category/login
      const pathParts = location.pathname.split('/');
      // ["", "cricket", "login"]
      let redirectBase = '/';
      if (pathParts.length >= 3 && pathParts[2] === 'login') {
        redirectBase = `/${pathParts[1]}`;
      }

      if (questionid) {
        sessionStorage.removeItem('redirectQuestionId');
        navigate(`${redirectBase}?questionid=${questionid}`, { replace: true });
      } else {
        navigate(redirectBase, { replace: true });
      }
    } catch (error) {
      // This will now show the exact API error message
      setErr(error.message || 'Login failed');
      analytics.trackEvent('Auth', 'Login Failure', error.message || 'Login failed');
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
              form="loginForm"
              disabled={loading}
              className="mx-auto w-[320px] max-w-full mb-5"
            >
              <CTAButton
                as="div"
                variant="primary"
              >
                <span className="font-inter font-[500] text-[18px] leading-[32px] tracking-[0.88px] text-[#5B037C]">
                  {loading ? 'Logging in…' : 'Login'}
                </span>
              </CTAButton>
            </button>
          </div>
        </div>
      }
    >
      {/* Brand */}
      <div className="mb-6">
        <Logo />
      </div>

      {/* Form */}
      <form id="loginForm" onSubmit={submit} className="w-full max-w-[360px] pb-20">
        {/* Google Login button */}
        <div className="mb-5">
          <GoogleAuthButton mode="login" onError={setErr} />
        </div>

        <div className="mb-5">
          <TextField
            id="usernameOrEmail"
            label="Email"
            name="usernameOrEmail"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Enter registered email"
            value={form.usernameOrEmail}
            onChange={onChange}
          />
        </div>

        <TextField
          id="password"
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter password"
          value={form.password}
          onChange={onChange}
          togglePassword
          containerClass="mt-0"
        />

        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            onClick={() => {
              // Track "Click on Forget Password"
              mixpanel.trackEvent("Click on Forget Password");
            }}
            className="text-[16px] leading-[24px] text-white/90 underline-offset-2 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {err ? <div className="mt-3 text-center text-[14px] text-red-200">{err}</div> : null}
      </form>
    </AuthShell>
  );
};

export default Login;
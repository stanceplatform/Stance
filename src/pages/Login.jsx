// pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthShell from '../components/layouts/AuthShell';
import Logo from '../components/ui/Logo';
import CTAButton from '../components/ui/CTAButton';
import TextField from '../components/ui/TextField';
import bg from '../assets/bg.svg';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
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
    try {
      await login(form);
      const to = location.state?.from?.pathname || '/dashboard';
      navigate(to, { replace: true });
    } catch (error) {
      // This will now show the exact API error message
      setErr(error.message || 'Login failed');
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
                <span className="font-intro font-[500] text-[22px] leading-[32px] tracking-[0.88px]">
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

        <div className="mt-2 text-center">
          <Link
            to="/forgot-password"
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
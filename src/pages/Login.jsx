// pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthShell from '../components/layouts/AuthShell';
import Logo from '../components/ui/Logo';
import CTAButton from '../components/ui/CTAButton';
import ApiService from '../services/api';
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
      await login(form); // <-- call AuthContext.login (this updates state + localStorage)
      const to = location.state?.from?.pathname || '/dashboard';
      navigate(to, { replace: true });
    } catch (e) {
      setErr(e.message || 'Login failed');
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
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21.9001 22.5002H20.1001C20.1001 18.4045 20.1001 15.9317 12.0001 15.9317C3.9001 15.9317 3.9001 18.4052 3.9001 22.5002H2.1001C2.1001 17.5997 2.81035 14.1325 12.0001 14.1325C21.1883 14.1325 21.9001 17.599 21.9001 22.5002ZM6.6001 6.75024C6.6001 3.20049 9.31585 1.34424 12.0001 1.34424C14.6843 1.34424 17.4001 3.20049 17.4001 6.75024C17.4001 9.93249 15.1801 12.1562 12.0001 12.1562C8.8201 12.1562 6.6001 9.93249 6.6001 6.75024ZM8.4001 6.75024C8.4001 8.97474 9.7801 10.3577 12.0001 10.3577C14.2201 10.3577 15.6001 8.97549 15.6001 6.75024C15.6001 4.26024 13.7926 3.14424 12.0001 3.14424C10.2076 3.14424 8.4001 4.26024 8.4001 6.75024Z"
                      fill="#5B037C"
                    />
                  </svg>
                }
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

// pages/Signup.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthShell from '../components/layouts/AuthShell';
import Logo from '../components/ui/Logo';
import CTAButton from '../components/ui/CTAButton';
import apiService from '../services/api';
import TextField from '../components/ui/TextField'; // ✅ reuse
import bg from '../assets/bg.svg';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Signup = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // token from invite link
  const tokenFromLink = useMemo(() => params.get('token') || '', [params]);

  const [form, setForm] = useState({
    name: '',
    alternateEmail: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setOk('');

    if (!tokenFromLink) {
      setErr('Signup link is missing or invalid.');
      return;
    }
    if (!form.name.trim()) {
      setErr('Please enter your name.');
      return;
    }
    if (!form.alternateEmail || !emailRegex.test(form.alternateEmail)) {
      setErr('Please enter a valid alternate email.');
      return;
    }
    if (!form.password || form.password.length < 6) {
      setErr('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErr('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        token: tokenFromLink,
        name: form.name.trim(),
        collegeId: null,
        alternateEmail: form.alternateEmail.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      };

      const res = await apiService.completeSignup(payload);
      if (res?.token) {
        apiService.setToken(res.token);
        if (res?.refreshToken) localStorage.setItem('refreshToken', res.refreshToken);
        if (res?.id || res?.email || res?.username) {
          localStorage.setItem('user', JSON.stringify({ id: res.id, email: res.email, username: res.username }));
        }
        setOk('Signup completed!');
        navigate('/dashboard');
      } else {
        setErr(res?.message || 'Signup failed. Please try again.');
      }
    } catch (e) {
      setErr(e?.message || 'Signup failed. Please try again.');
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
              form="completeSignupForm"
              disabled={loading}
              className="mx-auto w-[320px] max-w-full mb-5"
            >
              <CTAButton as="div" variant="primary">
                <span className="font-intro font-[500] text-[22px] leading-[32px] tracking-[0.88px]">
                  {loading ? 'Submitting…' : 'Submit'}
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
      {/* 👇 leave extra bottom padding so the fixed footer never hides fields on short screens */}
      <form id="completeSignupForm" onSubmit={submit} className="w-full max-w-[360px] pb-12">
        <TextField
          id="name"
          label="Name*"
          name="name"
          type="text"
          placeholder="Enter your name"
          value={form.name}
          onChange={onChange}
        />

        <div className="mt-4" />
        <TextField
          id="alternateEmail"
          label="Alternate Email ID*"
          name="alternateEmail"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Enter alternate email"
          value={form.alternateEmail}
          onChange={onChange}
        />

        <div className="mt-4" />
        <TextField
          id="college"
          label="College*"
          name="college"
          type="text"
          placeholder="11"
          value=""
          onChange={() => { }}
          disabled
          inputClass="bg-white/70 text-[#121212]/70 placeholder:text-gray-500"
        />

        <div className="mt-4" />
        <TextField
          id="password"
          label="Password*"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Enter password"
          value={form.password}
          onChange={onChange}
          togglePassword
        />

        <div className="mt-4" />
        <TextField
          id="confirmPassword"
          label="Confirm Password*"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm password"
          value={form.confirmPassword}
          onChange={onChange}
          togglePassword
        />

        {err ? <div className="mt-3 text-center text-[13px] text-red-200">{err}</div> : null}
        {ok ? <div className="mt-3 text-center text-[13px] text-green-200">{ok}</div> : null}
      </form>
    </AuthShell>
  );
};

export default Signup;

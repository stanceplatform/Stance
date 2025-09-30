// pages/Signup.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CTAButton from "../components/ui/CTAButton";
import apiService from "../services/api";
import TextField from "../components/ui/TextField";
import bg from "../assets/bg.svg";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // from invite link
  const tokenFromLink = useMemo(() => params.get("token") || "", [params]);

  // optional prefill (doesn't change payload)
  const emailFromLink = useMemo(() => params.get("email") || "", [params]);
  const collegeFromLink = useMemo(
    () => params.get("college") || "NITK Surathkal",
    [params]
  );

  const [form, setForm] = useState({
    studentEmail: emailFromLink,
    name: "",
    alternateEmail: "",
    password: "",
    confirmPassword: "",
    college: collegeFromLink,
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(""); // API/global errors
  const [ok, setOk] = useState("");
  const [fieldErrors, setFieldErrors] = useState({}); // field-level errors

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setFieldErrors((fe) => ({ ...fe, [name]: "" })); // clear error on change
  };

  const validateForm = () => {
    const errors = {};

    if (!form.studentEmail || !emailRegex.test(form.studentEmail)) {
      errors.studentEmail = "Please enter a valid student email.";
    }
    if (!form.name.trim()) {
      errors.name = "Please enter your name.";
    }
    if (!form.college.trim()) {
      errors.college = "Please enter your college.";
    }
    if (!form.alternateEmail || !emailRegex.test(form.alternateEmail)) {
      errors.alternateEmail = "Please enter a valid alternate email.";
    }
    if (!form.password) {
      errors.password = "Password is required.";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");

    // validate all fields
    if (!validateForm()) return;

    if (!tokenFromLink) {
      setErr("Signup link is missing or invalid.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        token: tokenFromLink,
        name: form.name.trim(),
        collegeId: null, // keep as is (college is display-only here)
        alternateEmail: form.alternateEmail.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      };

      const res = await apiService.completeSignup(payload);
      if (res?.token) {
        apiService.setToken(res.token);
        if (res?.refreshToken)
          localStorage.setItem("refreshToken", res.refreshToken);
        if (res?.id || res?.email || res?.username) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: res.id,
              email: res.email,
              username: res.username,
            })
          );
        }
        setOk("Signup completed!");
        navigate("/dashboard");
      } else {
        setErr(res?.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.data?.message || error.data?.error || error.message;
      setErr(errorMessage || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full">
      {/* Purple background layer */}
      <div
        className="relative min-h-screen w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        {/* Top row with logo (no back button) */}
        <div className="px-5 pt-6">
          <img
            src="/logo-white.svg"
            alt="stance"
            className="w-[98px]"
            draggable="false"
          />
        </div>

        {/* Main content */}
        <div className="px-7 pb-8">
          {/* Heading */}
          <h1 className="mt-6 text-start mb-6 font-intro font-[600] text-[36px] leading-[48px] tracking-[0.5px] text-[#F0E224]">
            Let’s get started!
          </h1>

          {/* Form */}
          <form id="completeSignupForm" onSubmit={submit} className="w-full">
            <TextField
              id="studentEmail"
              label="Student email*"
              name="studentEmail"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="your.name@college.edu"
              value={form.studentEmail}
              onChange={onChange}
              inputClass="bg-white text-[#121212] placeholder:text-gray-500"
              error={fieldErrors.studentEmail}
            />

            <div className="mt-4" />
            <TextField
              id="name"
              label="Name*"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={onChange}
              inputClass="bg-white text-[#121212] placeholder:text-gray-500"
              error={fieldErrors.name}
            />

            <div className="mt-4" />
            <TextField
              id="college"
              label="College*"
              name="college"
              type="text"
              value={form.college}
              onChange={onChange}
              disabled
              inputClass="bg-white text-[#121212] placeholder:text-gray-500 opacity-100"
              error={fieldErrors.college}
            />

            <div className="mt-4" />
            <TextField
              id="alternateEmail"
              label="Alternate email*"
              name="alternateEmail"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Enter email"
              value={form.alternateEmail}
              onChange={onChange}
              inputClass="bg-white text-[#121212] placeholder:text-gray-500"
              error={fieldErrors.alternateEmail}
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
              inputClass="bg-white text-[#121212] placeholder:text-gray-500"
              error={fieldErrors.password}
            />

            <div className="mt-4" />
            <TextField
              id="confirmPassword"
              label="Confirm Password*"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Enter password"
              value={form.confirmPassword}
              onChange={onChange}
              togglePassword
              inputClass="bg-white text-[#121212] placeholder:text-gray-500"
              error={fieldErrors.confirmPassword}
            />

            {/* Global API errors / success */}
            {err ? (
              <div className="mt-3 text-[13px] text-red-200">{err}</div>
            ) : null}
            {ok ? (
              <div className="mt-3 text-[13px] text-green-200">{ok}</div>
            ) : null}

            {/* Submit CTA */}
            <div className="mt-6 mb-10">
              <button
                type="submit"
                disabled={loading}
                className="w-[320px] max-w-full"
              >
                <CTAButton as="div" variant="primary">
                  <span className="font-intro font-[500] text-[22px] leading-[32px] tracking-[0.88px]">
                    {loading ? "Submitting…" : "Submit"}
                  </span>
                </CTAButton>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// pages/Signup.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import CTAButton from "../components/ui/CTAButton";
import apiService from "../services/api";
import TextField from "../components/ui/TextField";
import bg from "../assets/bg.svg";
import { useAuth } from "../context/AuthContext";
import analytics from "../utils/analytics";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const { authenticateWithTokens } = useAuth();

  const isCricket = useMemo(() => location.pathname.includes('/cricket'), [location.pathname]);

  // ----- Prefill from invite link -----
  const tokenFromLink = useMemo(() => params.get("token") || "", [params]);
  const emailFromLink = useMemo(() => params.get("email") || "", [params]);

  // Support both ?institute=<name> & ?instituteId=<id>
  const instituteNameFromLink = useMemo(
    () => (params.get("institute") || "").trim(),
    [params]
  );
  const instituteIdFromLink = useMemo(
    () =>
      (params.get("instituteId") || params.get("collegeId") || "").trim(),
    [params]
  );

  // Should we show the College field?
  // Show only if we have a non-empty name OR a valid id not equal to "-1"
  const showCollege = useMemo(() => {
    // If cricket context, hide college regardless
    if (isCricket) return false;

    if (instituteNameFromLink) return true;
    if (instituteIdFromLink && instituteIdFromLink !== "-1") return true;
    return false;
  }, [instituteNameFromLink, instituteIdFromLink, isCricket]);

  // What to display in the "College" field (when shown)
  const collegeDisplay = useMemo(() => {
    if (!showCollege) return "";
    return instituteNameFromLink || instituteIdFromLink;
  }, [showCollege, instituteNameFromLink, instituteIdFromLink]);

  const [form, setForm] = useState({
    studentEmail: emailFromLink,
    name: "",
    alternateEmail: "",
    password: "",
    confirmPassword: "",
    college: collegeDisplay, // display-only when shown
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setFieldErrors((fe) => ({ ...fe, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};

    if (!form.studentEmail || !emailRegex.test(form.studentEmail)) {
      errors.studentEmail = "Please enter a valid student email.";
    }
    if (!form.name.trim()) {
      errors.name = "Please enter your name.";
    }

    // College is required ONLY when it is shown
    if (showCollege && !isCricket) {
      if (!form.college.trim()) {
        errors.college = "College is required.";
      }
      if (!instituteIdFromLink || instituteIdFromLink === "-1") {
        errors.college = "Missing valid collegeId in invite link.";
      }
    }
    // Alternate email validation - skip if cricket
    if (!isCricket && (!form.alternateEmail || !emailRegex.test(form.alternateEmail))) {
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

    if (!validateForm()) return;
    if (!tokenFromLink) {
      setErr("Signup link is missing or invalid.");
      return;
    }

    // Track "Submit Signup"
    import('../utils/mixpanel').then(({ default: mixpanel }) => {
      mixpanel.trackEvent("Submit Signup");
    });

    analytics.trackEvent('Auth', 'Signup Attempt');

    setLoading(true);
    try {
      // Build payload; include collegeId only when College is shown/valid
      const payload = {
        token: tokenFromLink,
        name: form.name.trim(),
        alternateEmail: isCricket ? form.studentEmail : form.alternateEmail.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        ...(showCollege && instituteIdFromLink && instituteIdFromLink !== "-1" && !isCricket
          ? { collegeId: String(instituteIdFromLink) }
          : { collegeId: null }),
        tags: isCricket ? [{ tag_name: 'cricket', tag_type: 'INTEREST' }] : [],
      };

      const res = await apiService.completeSignup(payload);

      if (res?.token) {
        await authenticateWithTokens({
          token: res.token,
          refreshToken: res.refreshToken,
        });
        analytics.trackEvent('Auth', 'Signup Success');
        setOk("Signup completed!");
        navigate("/");
      } else {
        setErr(res?.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error?.data?.message || error?.data?.error || error?.message;
      setErr(errorMessage || "Signup failed. Please try again.");
      analytics.trackEvent('Auth', 'Signup Failure', errorMessage || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div
        className="relative min-h-screen w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="px-5 pt-6">
          <img
            src="/logo-white.svg"
            alt="stance"
            className="w-[98px]"
            draggable="false"
          />
        </div>

        <div className="px-7 pb-8">
          <h1 className="mt-6 text-start mb-6 font-intro font-[600] text-[36px] leading-[48px] tracking-[0.5px] text-[#F0E224]">
            Let’s get started!
          </h1>

          <form id="completeSignupForm" onSubmit={submit} className="w-full">
            {/* Student Email (locked) */}
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
              disabled
              inputClass="bg-white text-[#121212] placeholder:text-gray-500 opacity-100"
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

            {/* College (only when present/valid in link) */}
            {showCollege && (
              <>
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
              </>
            )}

            {/* Alternate Email (hide if cricket) */}
            {!isCricket && (
              <>
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
              </>
            )}

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

            {err ? <div className="mt-3 text-[13px] text-red-200">{err}</div> : null}
            {ok ? <div className="mt-3 text-[13px] text-green-200">{ok}</div> : null}

            <div className="mt-6 mb-5">
              <button type="submit" disabled={loading} className="w-[320px] max-w-full">
                <CTAButton as="div" variant="primary">
                  <span className="font-inter font-[500] text-[18px] leading-[32px] tracking-[0.88px]">
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

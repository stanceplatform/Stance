// pages/Help.jsx
import React, { useRef, useState } from "react";
import HeaderSecondary from "../components/ui/HeaderSecondary";
import apiService from "../services/api";

const FEEDBACK_TYPES = [
  { value: "GENERAL_FEEDBACK", label: "General Feedback" },
  { value: "BUG_REPORT", label: "Bug Report" },
  { value: "FEATURE_REQUEST", label: "Feature Request" },
  { value: "COMPLAINT", label: "Complaint" },
];
export default function Help() {
  const formRef = useRef(null);

  const [type, setType] = useState(FEEDBACK_TYPES[0]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setIsError(false);

    if (!subject.trim()) {
      setMsg("Please enter a subject.");
      setIsError(true);
      return;
    }
    if (!message.trim()) {
      setMsg("Please enter a message.");
      setIsError(true);
      return;
    }

    setLoading(true);
    try {
      await apiService.sendFeedback({
        subject: subject.trim(),
        message: message.trim(),
        type, // must match backend enum
      });
      setMsg("Thanks! Your feedback has been submitted.");
      setIsError(false);
      setSubject("");
      setMessage("");
      setType(FEEDBACK_TYPES[0]);
    } catch (error) {
      const errText =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Request failed. Please try again.";
      setMsg(errText);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[480px] bg-white min-h-screen">
      <div className="relative w-full">
        <HeaderSecondary />
        <div className="overflow-y-auto px-4 pt-24">
          <form ref={formRef} onSubmit={submit} className="w-full">
            {/* Page Title */}
            <h1 className="text-left font-intro font-[600] text-[32px] leading-[40px] text-[#707070] mb-6">
              Help
            </h1>

            {/* Type */}
            <label className="block text-left mb-2 text-[16px] leading-[20px] font-medium text-[#707070]">
              Type
            </label>
            <div className="relative mb-2">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-[48px] rounded-xl px-4 pr-10 text-[16px] outline-none bg-white text-[#121212] border border-[#E5E5E5] focus:border-[#BDBDBD] appearance-none cursor-pointer"
              >
                {FEEDBACK_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              {/* simple caret */}
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#121212]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.0002 13.7501L4.16211 7.87514L5.22523 6.81326L10.0002 11.587L14.7752 6.81201L15.8384 7.87514L10.0002 13.7501Z" fill="black" />
                </svg>
              </span>
            </div>
            <p className="text-left mb-5 text-[15px] leading-[22px] font-medium text-[#707070]">
              Choose what best describes your request.
            </p>

            {/* Subject */}
            <label
              htmlFor="fb_subject"
              className="block text-left mb-2 text-[16px] leading-[20px] font-medium text-[#707070]"
            >
              Subject*
            </label>
            <input
              id="fb_subject"
              type="text"
              placeholder="Brief subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full mb-5 rounded-xl px-4 h-[48px] text-[16px] outline-none bg-white text-[#707070] placeholder:text-[#A3A3A3] border border-[#E5E5E5] focus:border-[#BDBDBD]"
            />

            {/* Message */}
            <label
              htmlFor="fb_message"
              className="block text-left mb-2 text-[16px] leading-[20px] font-medium text-[#707070]"
            >
              Message*
            </label>
            <textarea
              id="fb_message"
              placeholder="Describe the issue or request in detail"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mb-6 rounded-xl px-4 py-3 text-[16px] leading-6 outline-none bg-white text-[#707070] placeholder:text-[#A3A3A3] border border-[#E5E5E5] focus:border-[#BDBDBD]"
            />

            {/* Helper text (unchanged) */}
            <p className="text-left text-[15px] leading-[22px] text-[#4E4E4E] mb-6">
              Our team will get back to you via email. Please ensure your
              account email is correct.
            </p>

            {/* Submit button (same UI) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#F0E224] text-[#5B037C] font-inter font-medium text-[18px] leading-[32px] shadow-sm disabled:opacity-60"
            >
              {loading ? "Submitting…" : "Submit"}
            </button>

            {/* Message */}
            {msg ? (
              <div
                className={`mt-4 text-[15px] leading-6 ${isError ? "text-red-700" : "text-emerald-700"
                  }`}
                aria-live="polite"
              >
                {msg}
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}

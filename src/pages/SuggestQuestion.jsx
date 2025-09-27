// pages/SuggestQuestion.jsx
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/layouts/AuthShell";
import Logo from "../components/ui/Logo";
import apiService from "../services/api";

const BackChevron = () => (
  <svg width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.4998 7.89989H4.17559L9.00409 12.7299L7.72984 14.0056L0.725586 6.99989L7.72984 -0.00585938L9.00409 1.26989L4.17559 6.09989H21.4998V7.89989Z" fill="white" />
  </svg>
);

const SuggestQuestion = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ question: "", option1: "", option2: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const formRef = useRef(null);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/dashboard", { replace: true });
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (!form.question.trim()) return "Please enter a question.";
    if (!form.option1.trim() || !form.option2.trim())
      return "Both options are required.";
    if (form.option1.trim() === form.option2.trim())
      return "Options must be different.";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setIsError(false);

    const v = validate();
    if (v) {
      setMsg(v);
      setIsError(true);
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.suggestQuestion({
        question: form.question.trim(),
        option1: form.option1.trim(),
        option2: form.option2.trim(),
      });
      setMsg(res?.message || "Thanks! Your suggestion has been submitted.");
      setForm({ question: "", option1: "", option2: "" });
      setIsError(false);
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
        {/* Purple header with back + logo (matches Figma) */}
        <div className="fixed inset-x-0 top-0 z-50 max-w-[480px] mx-auto">
          <div className="bg-[#9105C6] flex items-center px-4 py-5">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Go back"
              className="mr-3 p-2 -ml-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.5001 12.8999H5.17583L10.0043 17.7299L8.73008 19.0056L1.72583 11.9999L8.73008 4.99414L10.0043 6.26989L5.17583 11.0999H22.5001V12.8999Z" fill="#F0E224" />
              </svg>
            </button>
            <div className="">
              <img
                loading="lazy"
                src="/logo-sm.svg"
                alt="Logo"
                className="object-contain z-20 shrink-0 self-stretch my-auto aspect-auto w-[98px]"
              />
            </div>
          </div>
        </div>
        <div className="overflow-y-auto px-4 pt-24">
          {/* Form content */}
          <form
            id="suggestQuestionForm"
            ref={formRef}
            onSubmit={submit}
            className="w-full"
          >
            <h1 className="text-left font-intro font-[600] text-[32px] leading-[40px] text-[#707070] mb-6">
              Suggest question
            </h1>

            {/* Question */}
            <label
              htmlFor="sq_question"
              className="block text-left mb-2 text-[14px] leading-[20px] font-medium text-[#707070]"
            >
              Question*
            </label>
            <textarea
              id="sq_question"
              name="question"
              placeholder="Type your question"
              value={form.question}
              onChange={onChange}
              rows={4}
              className="w-full mb-5 rounded-xl px-4 py-3 text-[16px] leading-6 outline-none bg-white text-[#707070] placeholder:text-[#A3A3A3] border border-[#E5E5E5] focus:border-[#BDBDBD]"
            />

            {/* Yellow Option */}
            <label
              htmlFor="sq_option1"
              className="block text-left mb-2 text-[14px] leading-[20px] font-medium text-[#707070]"
            >
              Yellow Option*
            </label>
            <input
              id="sq_option1"
              name="option1"
              type="text"
              placeholder="Brief subject"
              value={form.option1}
              onChange={onChange}
              className="w-full mb-5 rounded-xl px-4 h-[48px] text-[16px] outline-none bg-white text-[#707070] placeholder:text-[#A3A3A3] border border-[#E5E5E5] focus:border-[#BDBDBD]"
            />

            {/* Purple option */}
            <label
              htmlFor="sq_option2"
              className="block text-left mb-2 text-[14px] leading-[20px] font-medium text-[#707070]"
            >
              Purple option*
            </label>
            <input
              id="sq_option2"
              name="option2"
              type="text"
              placeholder="Brief subject"
              value={form.option2}
              onChange={onChange}
              className="w-full mb-6 rounded-xl px-4 h-[48px] text-[16px] outline-none bgwhite text-[#1B1B1B] placeholder:text-[#A3A3A3] border border-[#E5E5E5] focus:border-[#BDBDBD]"
            />

            {/* Helper text */}
            <p className="text-left text-[14px] leading-[22px] text-[#4E4E4E] mb-6">
              Our team will get back to you via email. Please ensure your account
              email is correct.
            </p>

            {/* Submit */}
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
                className={`mt-4 text-[14px] leading-6 ${isError ? "text-red-700" : "text-emerald-700"
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
};

export default SuggestQuestion;

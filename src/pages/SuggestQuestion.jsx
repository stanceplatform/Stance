// pages/SuggestQuestion.jsx
import React, { useRef, useState, useEffect } from "react";
import apiService from "../services/api";
import HeaderSecondary from "../components/ui/HeaderSecondary";
import { useAuth } from "../context/AuthContext";
import LoginSignupModal from "../components/auth/LoginSignupModal";
import analytics from "../utils/analytics";
import { motion, AnimatePresence } from "framer-motion";

const SuggestQuestion = () => {
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({ question: "", option1: "", option2: "", isAnonymous: false });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
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

    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

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
        isAnonymous: !!form.isAnonymous,
      });

      // Show success animation
      setShowSuccess(true);
      setMsg(""); // Clear standard msg since we have the fancy one

      analytics.trackEvent("Content", "Suggest Question", form.question.trim());

      // Track "Submit Question"
      import('../utils/mixpanel').then(({ default: mixpanel }) => {
        mixpanel.trackEvent("Submit Question", { question: form.question.trim() });
      });

      setForm({ question: "", option1: "", option2: "", isAnonymous: false });
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
    <div className="mx-auto w-full max-w-[480px] bg-white min-h-screen relative overflow-hidden">
      <HeaderSecondary />
      <div className="px-4 pt-24 pb-8">
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
            className="w-full mb-5 rounded-xl px-4 py-3 text-[16px] leading-6 outline-none bg-white text-[#707070] placeholder:text-[#A3A3A3] border border-[#E5E5E5] focus:border-[#BDBDBD] transition-all duration-200"
          />

          {/* Yellow Option */}
          <label
            htmlFor="sq_option1"
            className="block text-left mb-2 text-[14px] leading-[20px] font-medium text-[#707070]"
          >
            Option 1
          </label>
          <input
            id="sq_option1"
            name="option1"
            type="text"
            placeholder="Enter Option 1"
            value={form.option1}
            onChange={onChange}
            className="w-full mb-5 rounded-xl px-4 h-[48px] text-[16px] outline-none bg-white text-[#707070] placeholder:text-[#A3A3A3] border border-[#E5E5E5] focus:border-[#BDBDBD] transition-all duration-200"
          />

          {/* Purple option */}
          <label
            htmlFor="sq_option2"
            className="block text-left mb-2 text-[14px] leading-[20px] font-medium text-[#707070]"
          >
            Option 2
          </label>
          <input
            id="sq_option2"
            name="option2"
            type="text"
            placeholder="Enter Option 2"
            value={form.option2}
            onChange={onChange}
            className="w-full mb-5 rounded-xl px-4 h-[48px] text-[16px] outline-none bg-white text-[#1B1B1B] placeholder:text-[#A3A3A3] border border-[#E5E5E5] focus:border-[#BDBDBD] transition-all duration-200"
          />

          {/* Suggest anonymously – default unchecked; value saved in DB */}
          <label className="flex items-center gap-3 text-left mb-6 cursor-pointer group">
            <input
              type="checkbox"
              name="isAnonymous"
              checked={!!form.isAnonymous}
              onChange={onChange}
              className="w-4 h-4 rounded border-[#E5E5E5] text-[#5B037C] focus:ring-[#5B037C] transition-colors"
            />
            <span className="text-[14px] leading-[20px] font-medium text-[#707070] group-hover:text-[#5B037C] transition-colors">
              Suggest anonymously
            </span>
          </label>

          {/* Helper text */}
          <p className="text-left text-[14px] leading-[22px] text-[#4E4E4E] mb-6">
            If your suggested question is selected, we’ll post it for debate
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#F0E224] text-[#5B037C] font-inter font-bold text-[18px] leading-[32px] shadow-sm active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting…
              </span>
            ) : "Submit"}
          </button>

          {/* Error Message */}
          {isError && msg ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-[14px] leading-6 text-red-600 font-medium text-center"
              aria-live="polite"
            >
              {msg}
            </motion.div>
          ) : null}
        </form>
      </div>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-[2px]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-[#5B037C] p-8 rounded-[32px] shadow-2xl flex flex-col items-center gap-4 max-w-[280px] w-full border-4 border-[#F0E224]"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-[#F0E224] rounded-full flex items-center justify-center"
              >
                <svg
                  className="w-12 h-12 text-[#5B037C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <h3 className="text-[#F0E224] font-intro font-bold text-[18px] text-center leading-tight">
                Question suggestion submitted successfully.
              </h3>
              <p className="text-white/80 text-[14px] text-center font-inter">
                Thank you for your contribution!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginSignupModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default SuggestQuestion;

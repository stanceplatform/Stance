// pages/SuggestQuestion.jsx
import React, { useRef, useState } from "react";
import apiService from "../services/api";
import HeaderSecondary from "../components/ui/HeaderSecondary";
import { useAuth } from "../context/AuthContext";
import LoginSignupModal from "../components/auth/LoginSignupModal";

const SuggestQuestion = () => {
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({ question: "", option1: "", option2: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const formRef = useRef(null);


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
        <HeaderSecondary />
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
              Option 1
            </label>
            <input
              id="sq_option1"
              name="option1"
              type="text"
              placeholder="Enter Option 1"
              value={form.option1}
              onChange={onChange}
              className="w-full mb-5 rounded-xl px-4 h-[48px] text-[16px] outline-none bg-white text-[#707070] placeholder:text-[#A3A3A3] border border-[#E5E5E5] focus:border-[#BDBDBD]"
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
              className="w-full mb-6 rounded-xl px-4 h-[48px] text-[16px] outline-none bgwhite text-[#1B1B1B] placeholder:text-[#A3A3A3] border border-[#E5E5E5] focus:border-[#BDBDBD]"
            />

            {/* Helper text */}
            <p className="text-left text-[14px] leading-[22px] text-[#4E4E4E] mb-6">
              If your suggested question is selected, we’ll post it anonymously for debate
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

      <LoginSignupModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default SuggestQuestion;

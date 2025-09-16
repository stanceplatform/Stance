import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthShell from "../layouts/AuthShell";
import CTAButton from "../ui/CTAButton";
import TextField from "../ui/TextField";
import apiService from "../../services/api";

/**
 * Suggest Question
 * - No logo
 * - Background: #F0E224
 * - Uses existing fonts/theme
 * - Shows backend message (success/error) and does NOT clear the form
 */
const SuggestQuestion = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    question: "",
    option1: "",
    option2: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");     // backend success OR error message
  const [isError, setIsError] = useState(false);

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

      // Expecting { success: boolean, message: string }
      setMsg(res?.message || "Thanks! Your suggestion has been submitted.");

    } catch (error) {
      const errText =
        error?.data?.message ||
        error?.data?.error ||
        error?.message ||
        "Request failed. Please try again.";
      setMsg(errText);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  // Sticky footer submit button (same pattern as RequestInvite)
  const footer =
    (
      <div className="px-6">
        <div className="flex justify-center">
          <button
            type="submit"
            form="suggestQuestionForm"
            disabled={loading}
            className="mx-auto w-[320px] max-w-full mb-5"
          >
            <CTAButton as="div" variant="secondary">
              <span className="font-intro font-[500] text-[22px] leading-[32px] tracking-[0.88px]">
                {loading ? "Submitting…" : "Submit Suggestion"}
              </span>
            </CTAButton>
          </button>
        </div>
      </div>
    );

  return (
    <AuthShell
      // If your AuthShell supports bgColor, this sets the yellow.
      // If not, it still looks fine—AuthShell’s default will apply.
      bgColor="bg-[#F0E224]"
      showBack
      onBack={() => navigate(-1)}
      footer={footer}
    >
      {/* No Logo on this screen */}

      <form id="suggestQuestionForm" onSubmit={submit} className="w-full max-w-[360px] pb-20">
        <h1 className="font-intro font-[700] text-[28px] leading-[36px] mb-4 text-[#1B1B1B]">
          Suggest a Question
        </h1>

        {/* QUESTION (textarea styled to match your inputs) */}
        <label
          htmlFor="sq_question"
          className="block mb-2 text-[14px] leading-6 font-medium text-[#1B1B1B]"
        >
          Question
        </label>
        <textarea
          id="sq_question"
          name="question"
          placeholder="Type your question…"
          value={form.question}
          onChange={onChange}
          rows={4}
          className="
            w-full mb-4 rounded-2xl px-4 py-3
            text-[16px] leading-6
            outline-none
            bg-white/90 text-[#1B1B1B]
            placeholder:text-[#777]
            shadow-[0_0_0_1px_rgba(0,0,0,0.06)] focus:shadow-[0_0_0_2px_rgba(0,0,0,0.16)]
          "
        />

        {/* OPTIONS (reuse TextField) */}
        <TextField
          id="sq_option1"
          label="Option 1"
          name="option1"
          type="text"
          placeholder="Enter first option"
          value={form.option1}
          onChange={onChange}
        />
        <div className="h-3" />
        <TextField
          id="sq_option2"
          label="Option 2"
          name="option2"
          type="text"
          placeholder="Enter second option"
          value={form.option2}
          onChange={onChange}
        />

        {/* Backend message (success/error). Keep visible; don’t clear form. */}
        {msg ? (
          <div
            className={`mt-4 text-[14px] leading-6 ${isError ? "text-red-700" : "text-emerald-800"
              }`}
            aria-live="polite"
          >
            {msg}
          </div>
        ) : null}
      </form>
    </AuthShell>
  );
};

export default SuggestQuestion;

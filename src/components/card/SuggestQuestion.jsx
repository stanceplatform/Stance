import React, { useEffect, useRef, useState } from "react";
import AuthShell from "../layouts/AuthShell";
import CTAButton from "../ui/CTAButton";
import TextField from "../ui/TextField";
import apiService from "../../services/api";

const SuggestQuestion = ({ onNext, onPrevious }) => {
  const [form, setForm] = useState({ question: "", option1: "", option2: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const formRef = useRef(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (!form.question.trim()) return "Please enter a question.";
    if (!form.option1.trim() || !form.option2.trim()) return "Both options are required.";
    if (form.option1.trim() === form.option2.trim()) return "Options must be different.";
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

  // Half-screen navigation (mouse/tap)
  const handlePageClick = (e) => {
    if (!onNext && !onPrevious) return;

    // 1) Ignore clicks inside the form
    if (formRef.current && formRef.current.contains(e.target)) return;

    // 2) Ignore clicks inside any nav-exempt area (e.g., footer submit)
    const target = e.target;
    if (target.closest('[data-nav-exempt="true"]')) return;

    const mid = window.innerWidth / 2;
    if (e.clientX < mid) onPrevious?.();
    else onNext?.();
  };

  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key === "ArrowLeft") onPrevious?.();
      if (ev.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onNext, onPrevious]);

  // Footer: mark as nav-exempt
  const footer = (
    <div className="px-6" data-nav-exempt="true">
      <div className="flex flex-col items-center gap-3">
        <button
          type="submit"
          form="suggestQuestionForm"
          disabled={loading}
          className="w-[320px] max-w-full"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()} // extra safety for mobile
        >
          <CTAButton as="div" variant="secondary">
            <span className="font-intro font-[500] text-[22px] leading-[32px] tracking-[0.88px]">
              {loading ? "Submitting…" : "Submit Suggestion"}
            </span>
          </CTAButton>
        </button>

        <p className="text-xs text-[#1B1B1B]/70 mt-1">
          Tip: Click/tap the left or right half of the screen to go Previous/Next.
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen" onClick={handlePageClick}>
      <AuthShell bgColor="bg-[#F0E224]" showBack={false} footer={footer}>
        <form
          id="suggestQuestionForm"
          ref={formRef}
          onSubmit={submit}
          className="w-full max-w-[360px] pb-20"
        >
          <h1 className="font-intro font-[700] text-[28px] leading-[36px] mb-5 text-[#1B1B1B]">
            Suggest a Question
          </h1>

          <label
            htmlFor="sq_question"
            className="block text-left mb-2 text-[14px] leading-6 font-medium text-[#1B1B1B]"
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
            className="w-full mb-4 rounded-2xl px-4 py-3 text-[16px] leading-6 outline-none bg-white/90 text-[#1B1B1B] placeholder:text-[#777] shadow-[0_0_0_1px_rgba(0,0,0,0.06)] focus:shadow-[0_0_0_2px_rgba(0,0,0,0.16)]"
          />

          <TextField
            id="sq_option1"
            label="Option 1"
            name="option1"
            type="text"
            labelClass="text-[#1B1B1B]"
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
            labelClass="text-[#1B1B1B]"
            placeholder="Enter second option"
            value={form.option2}
            onChange={onChange}
          />

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

      {/* Optional visual hints */}
      <div className="pointer-events-none fixed inset-y-0 left-0 w-1.5 bg-black/10" />
      <div className="pointer-events-none fixed inset-y-0 right-0 w-1.5 bg-black/10" />
    </div>
  );
};

export default SuggestQuestion;

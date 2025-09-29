// pages/ReportQuestion.jsx
import React, { useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import HeaderSecondary from "../components/ui/HeaderSecondary";
import apiService from "../services/api";

const REASONS = [
  "Hurtful",
  "Inappropriate content",
  "Personal attack",
  "Misinformation",
  "Irrelevant to me",
];

export default function ReportQuestion() {
  const [sp] = useSearchParams();
  const formRef = useRef(null);

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const questionId = useMemo(() => {
    const v = sp.get("questionId") ?? sp.get("question-id");
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [sp]);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setIsError(false);

    if (!reason) {
      setMsg("Please select a reason.");
      setIsError(true);
      return;
    }
    if (!description.trim()) {
      setMsg("Please add more details.");
      setIsError(true);
      return;
    }

    setLoading(true);
    try {
      await apiService.reportQuestion(questionId, {
        reason,
        description: description.trim(),
      });
      setMsg("Thanks! Your report has been submitted.");
      setIsError(false);
      setDescription("");
      setReason("");
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
            <h1 className="text-left font-intro font-[600] text-[36px] leading-[48px] text-[#707070] mb-6">
              Report question
            </h1>

            {/* Subheading */}
            <p className="text-left mb-4 text-[16px] leading-[20px] font-medium text-[#707070]">
              Help us understand the issue
            </p>

            {/* Reasons (custom radio: yellow ring, purple filled when checked) */}
            <div className="mb-6 space-y-3">
              {REASONS.map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-3 cursor-pointer select-none text-[#212121]"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={(e) => setReason(e.target.value)}
                    className="peer hidden"
                  />

                  {/* Outer ring */}
                  <span
                    className="grid place-items-center h-5 w-5 rounded-full border-2 transition-all
                 border-[#BEBEBE] peer-checked:border-[#BF24F9] peer-checked:border-[3px]"
                  >
                    {/* Inner dot (yellow) */}
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-[#F0E224] transition-all duration-150
                   peer-checked:scale-100 peer-checked:opacity-100 scale-0 opacity-0"
                    />
                  </span>

                  <span className="text-[16px] leading-6">{r}</span>
                </label>
              ))}



            </div>

            {/* Description */}
            <label
              htmlFor="rq_description"
              className="block text-left mb-2 text-[16px] leading-[20px] font-medium text-[#707070]"
            >
              Description*
            </label>
            <textarea
              id="rq_description"
              placeholder="Add more details"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

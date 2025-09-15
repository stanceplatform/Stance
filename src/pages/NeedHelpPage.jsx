import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiService from "../services/api"; // adjust import to your path

// Backend-allowed types
const FEEDBACK_TYPES = [
  { value: "GENERAL_FEEDBACK", label: "General Feedback" },
  { value: "BUG_REPORT", label: "Bug Report" },
  { value: "FEATURE_REQUEST", label: "Feature Request" },
  { value: "COMPLAINT", label: "Complaint" },
];

export default function NeedHelpPage() {
  const nav = useNavigate();
  const [sp] = useSearchParams();

  // Accept both ?questionId= and ?question-id=
  const questionId = useMemo(() => {
    const v = sp.get("questionId") ?? sp.get("question-id");
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [sp]);

  // Form state
  const [type, setType] = useState("GENERAL_FEEDBACK");
  const [subject, setSubject] = useState(
    questionId ? `Need help regarding question #${questionId}` : ""
  );
  const [message, setMessage] = useState("");

  // UX state
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  // Validation tracking
  const [touched, setTouched] = useState({
    subject: false,
    message: false,
  });
  const [submitted, setSubmitted] = useState(false);

  // Basic validation
  const subjectOk = subject.trim().length >= 4;
  const messageOk = message.trim().length >= 10;
  const canSubmit = subjectOk && messageOk && !!type && !submitting;

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");

    if (!canSubmit) return;

    try {
      setSubmitting(true);
      await apiService.sendFeedback({
        subject: subject.trim(),
        message: message.trim(),
        type, // must match backend enum
      });
      setDone(true);
      setMessage("");
    } catch (err) {
      console.error(err);
      setError("Failed to submit your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-neutral-900 text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-neutral-900/80 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-xl px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => nav(-1)}
            aria-label="Go back"
            className="p-2 rounded-xl hover:bg-white/10"
          >
            <span className="text-xl leading-none">&larr;</span>
          </button>
          <h1 className="text-lg font-semibold">Need Help</h1>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-4 py-6">
        {done ? (
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4">
            <p className="font-medium">
              Thanks! We received your request. Our team will get back to you via email.
            </p>
            <button
              onClick={() => nav(-1)}
              className="mt-4 inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
            {/* TYPE */}
            <div className="mb-4">
              <label htmlFor="feedback-type" className="block text-sm text-white/80">
                Type
              </label>
              <select
                id="feedback-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-2 w-full rounded-2xl bg-neutral-800/70 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
              >
                {FEEDBACK_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-white/50 text-left">
                Choose what best describes your request.
              </p>
            </div>

            {/* SUBJECT */}
            <div className="mb-4">
              <label htmlFor="feedback-subject" className="block text-sm text-white/80">
                Subject
              </label>
              <input
                id="feedback-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, subject: true }))}
                placeholder={
                  questionId ? `Need help regarding question #${questionId}` : "Brief subject"
                }
                className="mt-2 w-full rounded-2xl bg-neutral-800/70 border border-white/10 px-3 py-2 text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
                required
              />
              {(touched.subject || submitted) && !subjectOk && (
                <p className="mt-1 text-xs text-red-400 text-left">
                  Subject must be at least 4 characters.
                </p>
              )}
            </div>

            {/* MESSAGE */}
            <div>
              <label htmlFor="feedback-message" className="block text-sm text-white/80">
                Message
              </label>
              <textarea
                id="feedback-message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                placeholder="Describe the issue or request in detail…"
                className="mt-2 w-full rounded-2xl bg-neutral-800/70 border border-white/10 p-3 text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
                required
              />
              {(touched.message || submitted) && !messageOk && (
                <p className="mt-1 text-xs text-red-400 text-left">
                  Message must be at least 10 characters.
                </p>
              )}
            </div>

            {error && <p className="mt-3 text-sm text-red-400 text-left">{error}</p>}

            <p className="mt-4 text-xs text-white/60 text-left">
              Our team will get back to you via email. Please ensure your account email is correct.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => nav(-1)}
                className="rounded-2xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-2xl bg-fuchsia-700 px-5 py-2 text-sm font-semibold hover:bg-fuchsia-600 disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

import React, { useMemo, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/** Simple Google "G" SVG (brand-safe) */
const GoogleG = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const GoogleAuthButton = ({ mode = "signup", onError }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  // Match your existing shape logic (pill on signup page, rectangular on login)
  const isLoginRoute = useMemo(
    () => location.pathname.includes("/login"),
    [location.pathname]
  );
  const shapeClasses = isLoginRoute
    ? "rounded-lg"          // rectangular
    : "rounded-full";       // pill

  // Custom, fully controlled button → auth CODE flow (server will exchange)
  const startGoogle = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async ({ code }) => {
      try {
        setLoading(true);

        // Send only what server needs; rest the API can fetch after exchange.
        await loginWithGoogle({
          provider: "google",
          code,
          email: "",           // optional placeholders to keep your signature
          name: "",
          profilePicture: "",
          providerId: "",
        });

        const qp = new URLSearchParams(location.search);
        const questionid =
          qp.get("questionid") || sessionStorage.getItem("redirectQuestionId");

        if (questionid) {
          sessionStorage.removeItem("redirectQuestionId");
          navigate(`/?questionid=${questionid}`, { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch (err) {
        const msg =
          err?.message || "Google authentication failed. Please try again.";
        onError?.(msg);
        // eslint-disable-next-line no-console
        console.error("Google auth error:", err);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      onError?.("Google sign in was unsuccessful");
    },
  });

  return (
    <button
      type="button"
      onClick={() => !loading && startGoogle()}
      disabled={loading}
      className={[
        "max-w-[360px] mx-auto",
        mode === "signup" ? "w-11/12" : "w-full",
        "h-[56px]",
        "inline-flex items-center justify-center gap-2",
        "px-6",
        "bg-white text-gray-900",
        "shadow-sm hover:shadow transition-shadow",
        "border border-white/20",
        shapeClasses,
        "disabled:opacity-70 disabled:cursor-not-allowed",
      ].join(" ")}
      aria-label={mode === "signup" ? "Sign up with Google" : "Sign in with Google"}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="animate-spin inline-block w-4 h-4 rounded-full border-2 border-current border-t-transparent" />
          <span className="text-sm font-medium">
            {mode === "signup" ? "Signing up..." : "Signing in..."}
          </span>
        </span>
      ) : (
        <>
          <GoogleG />
          <span className="text-sm font-medium">
            {mode === "signup" ? "Sign up with Google" : "Sign in with Google"}
          </span>
        </>
      )}
    </button>
  );
};

export default GoogleAuthButton;

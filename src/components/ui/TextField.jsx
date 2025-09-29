import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

// small helper so we can pass conditionals
const cn = (...classes) => twMerge(classes.filter(Boolean).join(" "));

const EyeOn = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const EyeOff = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M3 3l18 18M10.58 10.58A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M9.88 4.12A10.93 10.93 0 0 1 12 4c5 0 9.27 3.11 10.73 7.5a11.2 11.2 0 0 1-3.07 4.73M6.18 6.18A11.05 11.05 0 0 0 1.27 11.5 11.2 11.2 0 0 0 8 17.94" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * Figma specs (defaults):
 * - Height: 56px (h-[56px])
 * - Radius: 16px (rounded-[16px])
 * - Border: 1px (border)
 * - Padding: py-3 px-4
 * - Gap for icons: 8px (gap-2)
 *
 * Now supports class overrides via tailwind-merge:
 * containerClass, labelClass, inputClass will be merged and override conflicts.
 */
export default function TextField({
  id,
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  inputMode,
  disabled = false,
  required = false,
  error = "",
  helperText = "",
  togglePassword = false,
  startIcon = null,
  endIcon = null,
  containerClass = "",
  labelClass = "",
  inputClass = "",
}) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = togglePassword || type === "password";
  const computedType = isPassword ? (showPw ? "text" : "password") : type;

  return (
    <div className={cn("w-full", containerClass)}>
      {label ? (
        <label
          htmlFor={id || name}
          className={cn(
            "block text-left text-[16px] leading-[20px] text-white mb-2",
            labelClass
          )}
        >
          {label}
        </label>
      ) : null}

      <div className="relative flex items-center gap-2">
        {startIcon ? (
          <span className="absolute left-3 text-gray-500">{startIcon}</span>
        ) : null}

        <input
          id={id || name}
          name={name}
          type={computedType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          disabled={disabled}
          required={required}
          className={cn(
            // defaults
            "w-full h-[56px] rounded-[8px] px-4 py-3",
            "bg-white text-[#121212] placeholder:text-[#9CA3AF]",
            "border border-[#D9D9D9]",
            "outline-none focus:ring-2 focus:ring-white/60 focus:border-white/80",
            "shadow-[0_1px_0_rgba(0,0,0,0.02)]",
            // conditionals
            startIcon && "pl-10",
            (endIcon || isPassword) && "pr-12",
            error && "border-red-400",
            // overrides/extensions from props
            inputClass
          )}
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        />

        {!isPassword && endIcon ? (
          <span className="pointer-events-none absolute right-3 text-gray-600">
            {endIcon}
          </span>
        ) : null}

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            className="absolute right-3 text-gray-600 hover:text-gray-800"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff /> : <EyeOn />}
          </button>
        ) : null}
      </div>

      {(error || helperText) && (
        <p className={cn("mt-1 text-[13px] break-words", error ? "text-red-200" : "text-white/80")}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}

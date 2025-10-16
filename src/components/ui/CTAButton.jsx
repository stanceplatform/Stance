import React from "react";
import { twMerge } from "tailwind-merge";

/**
 * Rounded CTA button with Figma typography + brand colors.
 *
 * Props:
 * - as: element/component to render (default 'button')
 * - type: button type when as === 'button'
 * - variant: 'primary' | 'secondary'
 * - icon?: JSX
 * - className?: string                // container overrides
 * - textClassName?: string            // text span overrides
 * - iconClassName?: string            // icon wrapper overrides
 */
const CTAButton = ({
  as: Component = "button",
  type = "button",
  icon = null,
  variant = "primary",
  children,
  className = "",
  textClassName = "",
  iconClassName = "",
  ...props
}) => {
  const base =
    "w-11/12 max-w-[360px] mx-auto flex h-[56px] items-center justify-center gap-2 rounded-full px-6 transition active:scale-[0.99] shadow-[0_2px_0_rgba(0,0,0,0.12)]";

  const color =
    variant === "primary"
      ? "bg-[#F0E224] text-[#75049F] hover:brightness-95"
      : "bg-[#75049F] text-white hover:brightness-110";

  const textBase =
    "font-intro font-[500] text-[22px] leading-[32px] tracking-[0.88px]";

  return (
    <Component
      type={Component === "button" ? type : undefined}
      className={twMerge(base, color, className)}
      {...props}
    >
      {icon ? (
        <span className={twMerge("inline-flex -mt-[1px]", iconClassName)}>
          {icon}
        </span>
      ) : null}
      <span className={twMerge(textBase, textClassName)}>{children}</span>
    </Component>
  );
};

export default CTAButton;

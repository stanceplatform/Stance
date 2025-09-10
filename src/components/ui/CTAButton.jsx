import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Rounded CTA button with Figma typography + brand colors.
 * Props:
 * - to: string
 * - variant: 'primary' | 'secondary'
 * - icon?: JSX
 */
const CTAButton = ({ as: Component = 'button', type = 'button', icon = null, variant = 'primary', children, ...props }) => {
  const base =
    'w-11/12 max-w-[360px] mx-auto flex h-[56px] items-center justify-center gap-2 rounded-full px-6 transition active:scale-[0.99] shadow-[0_2px_0_rgba(0,0,0,0.12)]';

  const styles =
    variant === 'primary'
      ? 'bg-[#F0E224] text-[#75049F] hover:brightness-95'
      : 'bg-[#75049F] text-white hover:brightness-110';

  const textStyles =
    'font-intro font-[500] text-[22px] leading-[32px] tracking-[0.88px]';

  return (
    <Component type={Component === 'button' ? type : undefined} className={`${base} ${styles}`} {...props}>
      {icon ? <span className="inline-flex -mt-[1px]">{icon}</span> : null}
      <span className={textStyles}>{children}</span>
    </Component>
  );
};

export default CTAButton;

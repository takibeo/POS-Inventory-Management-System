import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-700 focus:ring-slate-500 disabled:opacity-60',
  secondary:
    'border border-slate-300 bg-white text-slate-700 hover:border-slate-900 hover:text-slate-900 focus:ring-slate-400',
  danger:
    'border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 focus:ring-red-400',
  ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-400',
};

export default function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

import React, { forwardRef } from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "romantic" | "secondary" | "outline" | "ghost" | "champagne";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium tracking-wide transition-all duration-300 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A090C] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none font-ui";

    const sizeStyles = {
      sm: "text-xs px-3.5 py-2 gap-1.5 min-h-[36px]",
      md: "text-sm px-5 py-2.5 gap-2 min-h-[44px]",
      lg: "text-base px-7 py-3.5 gap-2.5 min-h-[50px]",
    }[size];

    const variantStyles = {
      primary:
        "bg-[#1A1824] text-ivory-50 shadow-md shadow-black/40 hover:bg-[#252232] hover:text-white border border-white/15 hover:border-white/30",
      romantic:
        "bg-gradient-to-r from-rose-600 via-rose-500 to-crimson-600 text-white shadow-lg shadow-rose-950/40 hover:from-rose-500 hover:to-crimson-500 hover:shadow-rose-900/50 border border-rose-500/30",
      secondary:
        "bg-white/[0.06] text-ivory-100 hover:bg-white/[0.12] hover:text-white border border-white/10 backdrop-blur-md",
      outline:
        "bg-transparent text-ivory-200 border border-white/15 hover:border-white/30 hover:bg-white/[0.04] hover:text-white",
      ghost:
        "bg-transparent text-ivory-300 hover:text-white hover:bg-white/[0.06]",
      champagne:
        "bg-gradient-to-r from-amber-600 to-champagne-600 text-white shadow-lg shadow-amber-950/50 hover:from-amber-500 hover:to-champagne-500 hover:shadow-amber-900/60 border border-amber-500/30",
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

"use client";

import { ButtonHTMLAttributes, ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost";
  loading?: boolean;
}

export function NeonButton({
  children,
  variant = "primary",
  loading = false,
  className,
  disabled,
  ...props
}: NeonButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  function press() { ref.current?.classList.add("neu-button-active"); }
  function release() { ref.current?.classList.remove("neu-button-active"); }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      onMouseDown={press}
      onMouseUp={release}
      onMouseLeave={release}
      onTouchStart={press}
      onTouchEnd={release}
      className={cn(
        "neu-button rounded-xl py-3 px-6 bg-surface font-semibold text-base flex items-center justify-center gap-2 transition-all duration-150",
        variant === "primary" ? "text-primary" : "text-on-surface-variant hover:text-primary",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

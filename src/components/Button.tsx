import React from "react";
import { useTranslations } from "@/providers/TranslationsProvider";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  loading = false,
  loadingText,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const { t } = useTranslations();

  const baseClasses = "font-medium transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm cursor-pointer";

  const variantClasses = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5 rounded-2xl",
    secondary: "bg-white/80 dark:bg-zinc-800/80 hover:bg-white/90 dark:hover:bg-zinc-700/90 text-zinc-900 dark:text-zinc-100 focus:ring-purple-500 shadow-md hover:shadow-lg hover:-translate-y-0.5 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5 rounded-2xl"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const widthClass = fullWidth ? "w-full" : "";

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`.trim();

  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>{loadingText || t("buttons.loading", "Loading...")}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
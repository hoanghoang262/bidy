"use client";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

interface ValidationMessageProps {
  message?: string;
  type?: "error" | "success" | "info" | "warning";
  show?: boolean;
  className?: string;
}

export default function ValidationMessage({
  message,
  type = "error",
  show = true,
  className = ""
}: ValidationMessageProps) {
  if (!show || !message) return null;

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          container: "text-green-600 dark:text-green-400",
          icon: "text-green-500"
        };
      case "info":
        return {
          container: "text-blue-600 dark:text-blue-400",
          icon: "text-blue-500"
        };
      case "warning":
        return {
          container: "text-yellow-600 dark:text-yellow-400",
          icon: "text-yellow-500"
        };
      case "error":
      default:
        return {
          container: "text-red-600 dark:text-red-400",
          icon: "text-red-500"
        };
    }
  };

  const styles = getStyles();

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className={`w-3.5 h-3.5 ${styles.icon}`} />;
      case "info":
        return <Info className={`w-3.5 h-3.5 ${styles.icon}`} />;
      case "warning":
      case "error":
      default:
        return <AlertCircle className={`w-3.5 h-3.5 ${styles.icon}`} />;
    }
  };

  return (
    <div 
      className={`
        animate-in slide-in-from-top-1 duration-200
        flex items-start gap-1.5 text-xs sm:text-sm
        ${styles.container}
        ${className}
      `}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      <span className="leading-tight">{message}</span>
    </div>
  );
}
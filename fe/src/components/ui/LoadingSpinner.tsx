"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "muted";
}

export default function LoadingSpinner({ 
  size = "md", 
  color = "primary" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  const colorClasses = {
    primary: "border-primary",
    white: "border-white",
    muted: "border-muted-foreground"
  };

  return (
    <div 
      className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin`}
      role="status"
      aria-label="Đang tải..."
    />
  );
}
"use client";
import { useState, useEffect, ReactNode } from "react";

interface AnimatedFormContainerProps {
  children: ReactNode;
  className?: string;
}

export default function AnimatedFormContainer({ 
  children, 
  className = "" 
}: AnimatedFormContainerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`transform transition-all duration-500 ease-out ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-4 opacity-0 scale-95"
      } ${className}`}
    >
      {children}
    </div>
  );
}
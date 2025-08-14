"use client";
import { ReactNode } from "react";

interface ResponsiveFormGridProps {
  children: ReactNode;
  columns?: 1 | 2;
  className?: string;
}

export default function ResponsiveFormGrid({ 
  children, 
  columns = 2, 
  className = "" 
}: ResponsiveFormGridProps) {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 min-[480px]:grid-cols-2"
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-2 sm:gap-3 ${className}`}>
      {children}
    </div>
  );
}
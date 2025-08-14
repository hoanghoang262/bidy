"use client";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export default function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  className = "" 
}: AuthLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-52px)] lg:min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-b from-background via-accent-foreground to-background py-2 sm:py-4">
      {/* Mobile-first responsive padding */}
      <div className="w-full px-4 sm:px-6">
        <div className={`w-full max-w-md mx-auto sm:max-w-lg lg:max-w-xl xl:max-w-2xl ${className}`}>
          {/* Header section with compact text sizes */}
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary tracking-wider mb-1 sm:mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-foreground-secondary max-w-md mx-auto leading-tight">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Main content area */}
          <div className="bg-card border border-border rounded-xl shadow-lg">
            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
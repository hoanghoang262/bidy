"use client";

import { useState, useEffect, ReactNode } from "react";

interface HydrationBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  suppressHydrationWarning?: boolean;
}

/**
 * A boundary component that handles hydration mismatches gracefully.
 * Ensures content is only rendered after hydration is complete.
 */
export function HydrationBoundary({ 
  children, 
  fallback = null,
  suppressHydrationWarning = true 
}: HydrationBoundaryProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Suppress hydration warnings if requested
  const wrapperProps = suppressHydrationWarning ? { suppressHydrationWarning: true } : {};

  if (!isHydrated) {
    return <div {...wrapperProps}>{fallback}</div>;
  }

  return <div {...wrapperProps}>{children}</div>;
}

/**
 * Hook for safe hydration checking
 */
export function useHydrationSafe() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * A component that only renders after hydration is complete.
 * Prevents hydration mismatches caused by browser extensions or dynamic content.
 */
export function NoSSR({ 
  children, 
  fallback = <div style={{ minHeight: '1px' }} /> 
}: { 
  children: ReactNode; 
  fallback?: ReactNode;
}) {
  const isHydrated = useHydrationSafe();

  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
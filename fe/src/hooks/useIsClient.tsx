"use client";

import { useState, useEffect, ReactNode } from "react";

/**
 * Hook to determine if the component is rendering on the client side.
 * Useful for preventing hydration mismatches when content differs between server and client.
 * 
 * @returns boolean - true if running on client, false if on server
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component wrapper to only render children on the client side.
 * Prevents hydration mismatches for dynamic content.
 */
export function ClientOnly({ 
  children, 
  fallback = null 
}: ClientOnlyProps) {
  const isClient = useIsClient();
  
  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
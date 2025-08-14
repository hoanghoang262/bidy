"use client";
import { useState, useEffect } from "react";
import { AlertCircle, X, RefreshCcw, Wifi, WifiOff } from "lucide-react";

interface ErrorAlertProps {
  error?: string | null;
  type?: "error" | "warning" | "network" | "validation";
  dismissible?: boolean;
  retryAction?: () => void;
  autoDisappear?: number; // seconds
  className?: string;
}

export default function ErrorAlert({
  error,
  type = "error",
  dismissible = true,
  retryAction,
  autoDisappear,
  className = ""
}: ErrorAlertProps) {
  const [isVisible, setIsVisible] = useState(!!error);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsVisible(!!error);
  }, [error]);

  useEffect(() => {
    // Auto-disappear functionality
    if (autoDisappear && isVisible) {
      const timer = setTimeout(() => setIsVisible(false), autoDisappear * 1000);
      return () => clearTimeout(timer);
    }
  }, [autoDisappear, isVisible]);

  useEffect(() => {
    // Network status monitoring
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isVisible || !error) return null;

  const getStyles = () => {
    switch (type) {
      case "error":
        return {
          container: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300",
          icon: "text-red-500",
          button: "text-red-600 hover:text-red-800"
        };
      case "warning":
        return {
          container: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300",
          icon: "text-yellow-500",
          button: "text-yellow-600 hover:text-yellow-800"
        };
      case "network":
        return {
          container: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300",
          icon: "text-blue-500",
          button: "text-blue-600 hover:text-blue-800"
        };
      case "validation":
        return {
          container: "bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300",
          icon: "text-orange-500",
          button: "text-orange-600 hover:text-orange-800"
        };
      default:
        return {
          container: "bg-red-50 border-red-200 text-red-800",
          icon: "text-red-500",
          button: "text-red-600 hover:text-red-800"
        };
    }
  };

  const styles = getStyles();

  const getIcon = () => {
    switch (type) {
      case "network":
        return isOnline ? <Wifi className={`w-5 h-5 ${styles.icon}`} /> : <WifiOff className={`w-5 h-5 ${styles.icon}`} />;
      default:
        return <AlertCircle className={`w-5 h-5 ${styles.icon}`} />;
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleRetry = () => {
    if (retryAction) {
      retryAction();
    }
  };

  return (
    <div 
      className={`
        animate-in slide-in-from-top-2 duration-300
        ${styles.container}
        border rounded-lg p-4 mb-4
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium leading-5">
            {error}
          </div>
          
          {type === "network" && !isOnline && (
            <div className="mt-2 text-xs">
              Kiểm tra kết nối internet và thử lại.
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-3">
          {retryAction && (
            <button
              onClick={handleRetry}
              className={`
                ${styles.button}
                p-1.5 rounded-md hover:bg-white/50 transition-colors
                focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current
              `}
              title="Thử lại"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          )}
          
          {dismissible && (
            <button
              onClick={handleDismiss}
              className={`
                ${styles.button}
                p-1.5 rounded-md hover:bg-white/50 transition-colors
                focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current
              `}
              title="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";
import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface ResponsiveInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const ResponsiveInput = forwardRef<HTMLInputElement, ResponsiveInputProps>(
  ({ label, error, helperText, icon, fullWidth = true, className, ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1.5 sm:gap-2 ${!fullWidth ? 'max-w-sm' : ''}`}>
        <label className="font-semibold text-foreground text-sm sm:text-base leading-tight">
          {label} {props.required && <span className="text-primary">*</span>}
        </label>
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-foreground-secondary">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            {...props}
            className={`
              w-full 
              px-3 py-2 sm:px-4 sm:py-2.5
              min-h-[40px] sm:min-h-[44px]
              ${icon ? 'pl-10 sm:pl-12' : ''} 
              border border-border rounded-lg 
              bg-background text-foreground 
              placeholder:text-foreground-secondary 
              text-sm sm:text-base leading-tight
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
              transition-all duration-200
              ${error ? 'border-red-500 focus:ring-red-500' : ''}
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            placeholder={`${props.placeholder || `Nhập ${label.toLowerCase()}`}`}
          />
        </div>
        
        {/* Error or helper text */}
        {(error || helperText) && (
          <div className="flex items-start gap-1.5">
            {error ? (
              <>
                <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-500 text-xs sm:text-sm">{error}</p>
              </>
            ) : (
              <p className="text-foreground-secondary text-xs sm:text-sm pl-5">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

ResponsiveInput.displayName = "ResponsiveInput";

export default ResponsiveInput;
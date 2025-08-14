"use client";
import { useState, forwardRef, InputHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    const isFloating = isFocused || hasValue || props.value;

    return (
      <div className="relative group">
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <div className={`transition-colors duration-200 ${
                isFocused ? "text-primary" : "text-foreground-secondary"
              }`}>
                {icon}
              </div>
            </div>
          )}
          
          <input
            ref={ref}
            {...props}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            className={`
              peer w-full px-4 py-3 border rounded-lg bg-background text-foreground
              placeholder-transparent
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
              transition-all duration-200
              ${icon ? "pl-12" : ""}
              ${error ? "border-red-500 focus:ring-red-500" : "border-border"}
              ${className}
            `}
            placeholder=" "
          />
          
          <label
            className={`
              absolute left-4 transition-all duration-200 pointer-events-none
              ${icon ? "left-12" : "left-4"}
              ${isFloating
                ? "-top-2 text-xs bg-background px-2 font-medium"
                : "top-1/2 transform -translate-y-1/2 text-base"
              }
              ${isFocused 
                ? "text-primary" 
                : error 
                ? "text-red-500" 
                : "text-foreground-secondary"
              }
            `}
          >
            {label} {props.required && <span className="text-primary">*</span>}
          </label>
        </div>
        
        {error && (
          <div className="mt-1 animate-in slide-in-from-top-1 duration-200">
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={12} />
              {error}
            </p>
          </div>
        )}
        
        {/* Animated focus indicator */}
        <div className={`
          absolute bottom-0 left-0 h-0.5 bg-primary transform origin-left
          transition-transform duration-200 ease-out
          ${isFocused ? "scale-x-100" : "scale-x-0"}
        `} />
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

export default AnimatedInput;
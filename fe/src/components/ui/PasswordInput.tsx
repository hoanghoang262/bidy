"use client";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Shield, Check, X } from "lucide-react";

interface PasswordInputProps {
  label: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  error?: string;
  showStrength?: boolean;
  showMatch?: boolean;
  originalPassword?: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special?: boolean;
  };
}

export default function PasswordInput({
  label,
  name,
  register,
  error,
  showStrength = false,
  showMatch = false,
  originalPassword = "",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: "Rất yếu",
    color: "bg-red-500",
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  });

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length;
    
    let label = "Rất yếu";
    let color = "bg-red-500";
    
    if (score >= 4) {
      label = "Mạnh";
      color = "bg-green-500";
    } else if (score >= 3) {
      label = "Trung bình";
      color = "bg-yellow-500";
    } else if (score >= 2) {
      label = "Yếu";
      color = "bg-orange-500";
    }

    return { score, label, color, requirements };
  };

  useEffect(() => {
    if (showStrength && value) {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  }, [value, showStrength]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const isPasswordMatch = showMatch && originalPassword && value && value === originalPassword;
  const isPasswordMismatch = showMatch && originalPassword && value && value !== originalPassword;

  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-foreground">
        {label} <span className="text-primary">*</span>
      </label>
      
      <div className="relative">
        <input
          {...register(name, {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)
          })}
          type={showPassword ? "text" : "password"}
          placeholder={`Nhập ${label.toLowerCase()}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full border rounded-md p-2 pr-10 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ${
            error 
              ? "border-red-500 focus:ring-red-500" 
              : isPasswordMatch 
              ? "border-green-500 focus:ring-green-500" 
              : isPasswordMismatch 
              ? "border-orange-500 focus:ring-orange-500"
              : "border-border"
          }`}
          autoComplete={name === "password" ? "new-password" : "new-password"}
        />
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground-secondary hover:text-foreground transition-colors"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        
        {/* Match indicator for confirm password */}
        {showMatch && originalPassword && value && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            {isPasswordMatch ? (
              <Check size={16} className="text-green-500" />
            ) : (
              <X size={16} className="text-orange-500" />
            )}
          </div>
        )}

        {/* Password strength indicator - absolutely positioned */}
        {showStrength && value && isFocused && (
          <div className="absolute top-full left-0 right-0 mt-2 p-2 sm:p-3 bg-card border border-border rounded-lg shadow-xl z-50 space-y-1 sm:space-y-2 max-w-sm mx-auto sm:max-w-none sm:mx-0">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-foreground-secondary" />
              <span className="text-xs text-foreground-secondary">Độ mạnh mật khẩu:</span>
              <span className={`text-xs font-medium ${
                passwordStrength.score >= 4 ? "text-green-600" : 
                passwordStrength.score >= 3 ? "text-yellow-600" : 
                passwordStrength.score >= 2 ? "text-orange-600" : "text-red-600"
              }`}>
                {passwordStrength.label}
              </span>
            </div>
            
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded transition-colors duration-300 ${
                    level <= passwordStrength.score
                      ? passwordStrength.color
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
            
            <div className="text-xs text-foreground-secondary space-y-0.5 sm:space-y-1">
              <div className={`flex items-center gap-1 ${passwordStrength.requirements.length ? "text-green-600" : "text-muted-foreground"}`}>
                {passwordStrength.requirements.length ? <Check size={10} className="sm:size-3" /> : <X size={10} className="sm:size-3" />}
                <span className="text-xs sm:text-sm">Ít nhất 8 ký tự</span>
              </div>
              <div className={`flex items-center gap-1 ${passwordStrength.requirements.uppercase ? "text-green-600" : "text-muted-foreground"}`}>
                {passwordStrength.requirements.uppercase ? <Check size={10} className="sm:size-3" /> : <X size={10} className="sm:size-3" />}
                <span className="text-xs sm:text-sm">Chữ hoa (A-Z)</span>
              </div>
              <div className={`flex items-center gap-1 ${passwordStrength.requirements.lowercase ? "text-green-600" : "text-muted-foreground"}`}>
                {passwordStrength.requirements.lowercase ? <Check size={10} className="sm:size-3" /> : <X size={10} className="sm:size-3" />}
                <span className="text-xs sm:text-sm">Chữ thường (a-z)</span>
              </div>
              <div className={`flex items-center gap-1 ${passwordStrength.requirements.number ? "text-green-600" : "text-muted-foreground"}`}>
                {passwordStrength.requirements.number ? <Check size={10} className="sm:size-3" /> : <X size={10} className="sm:size-3" />}
                <span className="text-xs sm:text-sm">Số (0-9)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Password match feedback */}
      {showMatch && originalPassword && value && (
        <div className={`text-xs flex items-center gap-1 ${
          isPasswordMatch ? "text-green-600" : "text-orange-600"
        }`}>
          {isPasswordMatch ? <Check size={12} /> : <X size={12} />}
          <span>
            {isPasswordMatch ? "Mật khẩu khớp" : "Mật khẩu không khớp"}
          </span>
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
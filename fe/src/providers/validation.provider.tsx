'use client';

import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { runStartupValidation, debugEnvironment } from '@/utils/env.validator';
import { appConfig } from '@/config/app.config';

interface ValidationContextType {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  isLoading: boolean;
}

const ValidationContext = createContext<ValidationContextType>({
  isValid: true,
  errors: [],
  warnings: [],
  isLoading: true,
});

export const useValidation = () => useContext(ValidationContext);

export default function ValidationProvider({ children }: PropsWithChildren) {
  const [validationState, setValidationState] = useState<ValidationContextType>({
    isValid: true,
    errors: [],
    warnings: [],
    isLoading: true,
  });

  useEffect(() => {
    // Run validation on mount
    try {
      const result = runStartupValidation();
      
      setValidationState({
        isValid: result.isValid,
        errors: result.errors,
        warnings: result.warnings,
        isLoading: false,
      });

      // Debug environment in development
      if (appConfig.dev.isDevelopment) {
        debugEnvironment();
      }
    } catch (error) {
      console.error('Validation failed:', error);
      setValidationState({
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Unknown validation error'],
        warnings: [],
        isLoading: false,
      });
    }
  }, []);

  // Show loading state during validation
  if (validationState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating environment configuration...</p>
        </div>
      </div>
    );
  }

  // Show error state if validation failed in production
  if (!validationState.isValid && appConfig.dev.isProduction) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="max-w-md mx-auto text-center p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h1 className="text-xl font-semibold text-red-800 mb-4">Configuration Error</h1>
          <p className="text-red-600 mb-4">
            Configuration validation failed. Please check the following errors:
          </p>
          <div className="mb-4 p-3 bg-red-100 rounded-md text-left">
            <ul className="text-sm text-red-700 space-y-1">
              {validationState.errors.map((error, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
          <details className="text-left">
            <summary className="cursor-pointer text-red-700 font-medium">Error Details</summary>
            <ul className="mt-2 text-sm text-red-600">
              {validationState.errors.map((error, index) => (
                <li key={index} className="mt-1">• {error}</li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    );
  }

  // Show warnings in development
  if (!validationState.isValid && appConfig.dev.isDevelopment) {
    console.warn('⚠️ Environment validation warnings detected but continuing in development mode');
  }

  return (
    <ValidationContext.Provider value={validationState}>
      {children}
    </ValidationContext.Provider>
  );
}
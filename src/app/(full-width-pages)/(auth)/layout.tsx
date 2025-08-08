"use client"
import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { LocaleProvider } from "@/hooks/useLocales";

// Loading component
const AuthLoadingScreen = () => {
  return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          {/* Logo */}
          <div className="w-16 h-16 bg-brand-950 dark:bg-white/20 rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>

          {/* Loading text */}
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Loading...
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Klaxona Admin Dashboard
            </p>
          </div>

          {/* Loading dots animation */}
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-brand-600 dark:bg-white/60 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-brand-600 dark:bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-brand-600 dark:bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
  );
};

export default function AuthLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted
    setIsMounted(true);

    // Simulate initial loading time to prevent FOUC
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!isMounted) {
    return <AuthLoadingScreen />;
  }

  // Show loading screen during initial load
  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  return (
      <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
        <ThemeProvider>
          <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0 opacity-0 animate-fadeIn">
            <LocaleProvider initialLocale="en">
              {children}
            </LocaleProvider>

            <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
              <div className="relative items-center justify-center flex z-1">
                {/* <!-- ===== Common Grid Shape Start ===== --> */}
                <GridShape />
                <div className="flex flex-col items-center max-w-xs">
                  <Image
                      width={231}
                      height={48}
                      src="./images/logo/auth-logo.svg"
                      alt="Logo"
                      priority // Add priority for faster loading
                  />
                  <p className="text-center text-gray-400 dark:text-white/60 mt-3">
                    Klaxona Admin Dashboard
                  </p>
                </div>
              </div>
            </div>

            <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
              <ThemeTogglerTwo />
            </div>
          </div>
        </ThemeProvider>

        {/* Add custom styles for fade-in animation */}
        <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
      </div>
  );
}
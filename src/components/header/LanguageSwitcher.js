"use client"
import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from '../../hooks/useLocales.js';

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function LanguageSwitcher() {
    const { locale, changeLocale } = useLocale();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Get current language info
    const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLanguageChange = (langCode) => {
        changeLocale(langCode);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Toggle Button - Shows current language flag */}
            <button
                onClick={toggleDropdown}
                className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                aria-label="Switch Language"
            >
                {/* Current Language Flag */}
                <span className="text-2xl">{currentLanguage.flag}</span>

                {/* Small dropdown indicator */}
                <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-4 h-4 bg-gray-500 dark:bg-gray-400 rounded-full">
                    <svg
                        className="w-2 h-2 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                                    locale === lang.code
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300'
                                }`}
                            >
                                <span className="text-xl">{lang.flag}</span>
                                <div className="flex flex-col">
                                    <span className="font-medium">{lang.name}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                        {lang.code}
                                    </span>
                                </div>
                                {locale === lang.code && (
                                    <svg
                                        className="ml-auto w-4 h-4 text-blue-600 dark:text-blue-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
// 2. hooks/useLocales.js - Fixed hook
"use client"
import { createContext, useContext, useState, useEffect } from 'react'
import { getDictionary } from '../../lib/dictionaries.js'

const LocaleContext = createContext()

// Provider pour envelopper votre app
export function LocaleProvider({ children, initialLocale = 'en' }) {
    const [locale, setLocale] = useState(initialLocale)
    const [dictionary, setDictionary] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    // Fonction pour charger le dictionnaire
    const loadDictionary = async (newLocale) => {
        try {
            setIsLoading(true)
            const dict = await getDictionary(newLocale)
            setDictionary(dict)
            setLocale(newLocale)

            // Sauvegarder dans localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('preferred-locale', newLocale)
            }
        } catch (error) {
            console.error('Failed to load dictionary:', error)
            // En cas d'erreur, utiliser le dictionnaire anglais par défaut
            const fallbackDict = await getDictionary('en')
            setDictionary(fallbackDict)
            setLocale('en')
        } finally {
            setIsLoading(false)
        }
    }

    // Initialiser au montage
    useEffect(() => {
        // Vérifier localStorage ou utiliser la langue du navigateur
        let preferredLocale = initialLocale

        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('preferred-locale')
            if (saved) {
                preferredLocale = saved
            } else {
                // Détecter la langue du navigateur
                const browserLang = navigator.language.substring(0, 2)
                if (['en', 'fr'].includes(browserLang)) {
                    preferredLocale = browserLang
                }
            }
        }

        loadDictionary(preferredLocale)
    }, [initialLocale])

    const changeLocale = (newLocale) => {
        if (newLocale !== locale) {
            loadDictionary(newLocale)
        }
    }

    return (
        <LocaleContext.Provider value={{
            locale,
            dictionary,
            changeLocale,
            isLoading
        }}>
            {children}
        </LocaleContext.Provider>
    )
}

// Hook pour utiliser le contexte
export function useLocale() {
    const context = useContext(LocaleContext)
    if (!context) {
        throw new Error('useLocale must be used within a LocaleProvider')
    }
    return context
}
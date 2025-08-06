// 1. lib/dictionaries.js - Updated with better error handling
import enDict from '../public/dictionaries/en.json'
import frDict from '../public/dictionaries/fr.json'

const dictionaries = {
    en: enDict,
    fr: frDict
}

export const getDictionary = async (locale) => {
    // Validation et fallback
    if (!locale || !dictionaries[locale]) {
        console.warn(`Dictionary for locale "${locale}" not found, falling back to "en"`)
        return dictionaries['en']
    }

    return dictionaries[locale]
}

// Version synchrone si vous préférez
export const getDictionarySync = (locale) => {
    if (!locale || !dictionaries[locale]) {
        return dictionaries['en']
    }
    return dictionaries[locale]
}
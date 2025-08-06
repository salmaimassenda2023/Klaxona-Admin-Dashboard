// 6. utils/translations.js - Helper functions for translations
export const createTranslationFunction = (dictionary, isLoading) => {
    return (key, fallback = key) => {
        if (isLoading || !dictionary) {
            return fallback
        }

        const keys = key.split('.')
        let value = dictionary
        for (const k of keys) {
            value = value?.[k]
        }
        return value || fallback
    }
}

export const createTranslationWithParams = (dictionary, isLoading) => {
    return (key, params = {}, fallback = key) => {
        if (isLoading || !dictionary) {
            return fallback
        }

        let translation = createTranslationFunction(dictionary, isLoading)(key, fallback)

        if (typeof translation === 'string') {
            // Replace {{param}} with actual values
            Object.keys(params).forEach(param => {
                const regex = new RegExp(`{{${param}}}`, 'g')
                translation = translation.replace(regex, params[param])
            })

            // Handle simple pluralization
            if (params.count !== undefined) {
                const count = params.count
                // Simple plural handling for English
                if (count === 1) {
                    translation = translation.replace(/{{count, plural, one \{\} other \{s\}}}/g, '')
                } else {
                    translation = translation.replace(/{{count, plural, one \{\} other \{s\}}}/g, 's')
                }
            }
        }
        return translation
    }
}
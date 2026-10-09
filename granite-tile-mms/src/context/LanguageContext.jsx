import { createContext, useContext, useState } from 'react'
import { translations } from '../data/translations.js'

const LanguageContext = createContext(null)
const LANG_KEY = 'gtmms_lang'

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'en'
    return localStorage.getItem(LANG_KEY) || 'en'
  })

  const changeLang = (code) => {
    setLang(code)
    localStorage.setItem(LANG_KEY, code)
  }

  const t = (key) => {
    if (!key) return ''
    const currentDict = translations[lang] || translations.en
    if (currentDict[key]) return currentDict[key]

    const strKey = String(key).trim()
    if (currentDict[strKey]) return currentDict[strKey]

    const lowerKey = strKey.toLowerCase()
    if (currentDict[lowerKey]) return currentDict[lowerKey]

    // Fallback to English dictionary
    if (translations.en[key]) return translations.en[key]
    if (translations.en[strKey]) return translations.en[strKey]
    if (translations.en[lowerKey]) return translations.en[lowerKey]

    return key
  }

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a <LanguageProvider>')
  return ctx
}

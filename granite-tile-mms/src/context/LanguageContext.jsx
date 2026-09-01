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

  const t = (key) => translations[lang]?.[key] || translations.en[key] || key

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

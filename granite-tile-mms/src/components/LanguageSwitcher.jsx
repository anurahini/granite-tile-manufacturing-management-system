import { useState } from 'react'
import { Languages } from 'lucide-react'
import { languages } from '../data/translations.js'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function LanguageSwitcher({ className = '' }) {
  const { lang, changeLang } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <div className="lang-switcher" style={{ position: 'relative' }}>
      <button
        className={`icon-btn ${className}`}
        onClick={() => setOpen(!open)}
        title="Change language"
        aria-label="Change language"
      >
        <Languages size={18} />
      </button>
      {open && (
        <div className="lang-dropdown" onMouseLeave={() => setOpen(false)}>
          {languages.map((l) => (
            <button
              key={l.code}
              className={`lang-option ${lang === l.code ? 'active' : ''}`}
              onClick={() => { changeLang(l.code); setOpen(false) }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

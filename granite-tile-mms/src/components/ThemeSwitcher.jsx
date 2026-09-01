import { useState } from 'react'
import { Sun, Moon, Gem, Mountain } from 'lucide-react'
import { useTheme, themes } from '../context/ThemeContext.jsx'

const themeIcons = {
  light: Sun,
  dark: Moon,
  luxury: Gem,
  'granite-black': Mountain,
}

export default function ThemeSwitcher({ className = '' }) {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const CurrentIcon = themeIcons[theme] || Sun

  return (
    <div className="theme-switcher" style={{ position: 'relative' }}>
      <button
        className={`icon-btn ${className}`}
        onClick={() => setOpen(!open)}
        title="Change theme"
        aria-label="Change theme"
      >
        <CurrentIcon size={18} />
      </button>
      {open && (
        <div className="lang-dropdown" onMouseLeave={() => setOpen(false)}>
          {themes.map((th) => {
            const Icon = themeIcons[th.key]
            return (
              <button
                key={th.key}
                className={`lang-option ${theme === th.key ? 'active' : ''}`}
                onClick={() => { setTheme(th.key); setOpen(false) }}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Icon size={14} /> {th.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

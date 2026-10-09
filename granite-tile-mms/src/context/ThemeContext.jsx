import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)
const THEME_KEY = 'gtmms_theme'
const DENSITY_KEY = 'gtmms_density'
const FONT_SCALE_KEY = 'gtmms_font_scale'

export const themes = [
  { key: 'light', label: 'Quarry Orange', name: 'Quarry Orange', colors: ['#e2672a', '#211d1a', '#f7efe2'] },
  { key: 'dark', label: 'Charcoal Slate', name: 'Charcoal Slate', colors: ['#332c26', '#867b6d', '#f7efe2'] },
  { key: 'luxury', label: 'Terracotta Warm', name: 'Terracotta Warm', colors: ['#c8891e', '#5a5148', '#efe1c8'] },
  { key: 'granite-black', label: 'Granite Obsidian', name: 'Granite Obsidian', colors: ['#111111', '#5a5148', '#ffffff'] },
]

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return localStorage.getItem(THEME_KEY) || 'light'
  })

  const [density, setDensity] = useState(() => {
    if (typeof window === 'undefined') return 'Comfortable'
    return localStorage.getItem(DENSITY_KEY) || 'Comfortable'
  })

  const [fontScale, setFontScale] = useState(() => {
    if (typeof window === 'undefined') return 'Medium'
    return localStorage.getItem(FONT_SCALE_KEY) || 'Medium'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-density', (density || 'Comfortable').toLowerCase())
    localStorage.setItem(DENSITY_KEY, density)
  }, [density])

  useEffect(() => {
    document.documentElement.setAttribute('data-font-scale', (fontScale || 'Medium').toLowerCase())
    localStorage.setItem(FONT_SCALE_KEY, fontScale)
  }, [fontScale])

  const toggleTheme = () => {
    setTheme((t) => {
      const idx = themes.findIndex((th) => th.key === t)
      return themes[(idx + 1) % themes.length].key
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, density, setDensity, fontScale, setFontScale, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a <ThemeProvider>')
  return ctx
}

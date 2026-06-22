import { createContext, useContext, useEffect, useState } from 'react'

const THEMES = [
  { id: 'one-dark', label: 'One Dark', hint: 'Cool blue-greys · night', swatch: ['#282c34', '#61afef', '#98c379'] },
  { id: 'gruvbox', label: 'Gruvbox', hint: 'Warm vintage earth', swatch: ['#282828', '#fabd2f', '#b8bb26'] },
  { id: 'material', label: 'Material', hint: 'Clean high-contrast light', swatch: ['#f4f6fb', '#4361ee', '#2e9e6b'] },
]

const ThemeContext = createContext(null)
const STORAGE_KEY = 'mindvault.theme'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'one-dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { AppProvider } from './context/AppContext.jsx'
import App from './App.jsx'

import './styles/themes.css'
import './styles/global.css'
import './styles/features.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>
)

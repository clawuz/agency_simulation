import { createContext, useContext, useState } from 'react'
import { STRINGS } from '../data/i18n'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('tr')

  function t(key) {
    const entry = STRINGS[key]
    if (!entry) return key
    return entry[lang] ?? entry['en'] ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}

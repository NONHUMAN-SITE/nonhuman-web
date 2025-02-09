'use client'
import { useLanguage } from '@/app/context/LanguageContext'
import { useTheme } from '@/app/context/ThemeContext'

export default function SOARM100Page() {
  const { language } = useLanguage()
  const { theme } = useTheme()

  return (
    <div 
      className={`${theme}`}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        fontFamily: '"Space Mono", monospace'
      }}
    >
      <h1 
        style={{
          fontSize: '4rem',
          color: 'var(--accent-color)',
          textAlign: 'center'
        }}
      >
        SOON...
      </h1>
      <p
        style={{
          fontSize: '1.5rem',
          color: 'var(--accent-color)',
          opacity: 0.7,
          textAlign: 'center'
        }}
      >
        {language === 'en' 
          ? 'This content is under development'
          : 'Este contenido está en desarrollo'}
      </p>
    </div>
  )
}

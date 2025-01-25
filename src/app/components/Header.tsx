'use client'
import Link from 'next/link'
import { HiLanguage } from "react-icons/hi2"
import { useLanguage } from '../context/LanguageContext'

export default function Header() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <header className="header" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(0, 0, 0, 0.9)', // Fondo semi-transparente
      backdropFilter: 'blur(5px)' // Efecto de desenfoque
    }}>
      <nav className="nav-container">
        <ul className="nav-list">
          <li><Link href="/">{language === 'en' ? 'Home' : 'Inicio'}</Link></li>
          <li><Link href="/research">{language === 'en' ? 'Research' : 'Investigación'}</Link></li>
          <li><Link href="/newspaper">{language === 'en' ? 'Newspaper' : 'Noticias'}</Link></li>
          <li><Link href="/community">{language === 'en' ? 'Community' : 'Comunidad'}</Link></li>
        </ul>
        <div className="language-toggle-container">
          <button onClick={toggleLanguage} className="language-toggle">
            <HiLanguage className="language-icon" />
            {language.toUpperCase()}
          </button>
        </div>
      </nav>
    </header>
  )
}

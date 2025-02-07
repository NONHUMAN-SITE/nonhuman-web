'use client'
import Link from 'next/link'
import Image from 'next/image'
import { HiLanguage } from "react-icons/hi2"
import { BsSun, BsMoon } from "react-icons/bs"
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

export default function Header() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="header" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.9)' : '#fffaf2',
      backdropFilter: 'blur(5px)'
    }}>
      <nav className="nav-container">
        <Link href="/" className="logo-container">
          <Image
            src="/NONHUMAN-LOGO.png"
            alt="NONHUMAN Logo"
            width={50}
            height={50}
            className="logo-image"
            style={{ borderRadius: '8px' }}
          />
        </Link>
        <ul className="nav-list">
          <li><Link href="/">{language === 'en' ? 'Home' : 'Inicio'}</Link></li>
          <li><Link href="/research">{language === 'en' ? 'Research' : 'Investigación'}</Link></li>
          <li><Link href="/articles">{language === 'en' ? 'Articles' : 'Articulos'}</Link></li>
          <li><Link href="/community">{language === 'en' ? 'Community' : 'Comunidad'}</Link></li>
        </ul>
        <div className="language-toggle-container">
          <button onClick={toggleLanguage} className="language-toggle">
            <HiLanguage className="language-icon" />
            {language.toUpperCase()}
          </button>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'dark' ? <BsSun className="theme-icon" /> : <BsMoon className="theme-icon" />}
          </button>
        </div>
      </nav>
    </header>
  )
}

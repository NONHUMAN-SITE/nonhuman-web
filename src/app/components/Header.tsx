'use client'
import Link from 'next/link'
import Image from 'next/image'
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
        </div>
      </nav>
    </header>
  )
}

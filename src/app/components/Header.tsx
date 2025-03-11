'use client'
import Link from 'next/link'
import { useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoMdClose } from 'react-icons/io'
import { GrLanguage } from "react-icons/gr";
import { BsSun, BsMoon } from "react-icons/bs"
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

export default function Header() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Cierra el menú móvil al hacer clic en un enlace
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'var(--background-color)',
      backdropFilter: 'blur(5px)'
    }}>
      <nav className="nav-container">
        <Link href="/" className="logo-container" onClick={handleLinkClick}>
          <span className="logo-text">N</span>
        </Link>
        {/* Botón para mostrar/ocultar el menú en versión móvil */}
        <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <IoMdClose className="menu-icon" /> : <GiHamburgerMenu className="menu-icon" />}
        </button>
        <ul className={`nav-list ${isMobileMenuOpen ? 'open' : ''}`}>
          <li><Link href="/about" onClick={handleLinkClick}>{language === 'en' ? 'About' : 'Nosotros'}</Link></li>
          <li><Link href="/projects" onClick={handleLinkClick}>{language === 'en' ? 'Projects' : 'Proyectos'}</Link></li>
          <li><Link href="/articles" onClick={handleLinkClick}>{language === 'en' ? 'Articles' : 'Articulos'}</Link></li>
          <li><Link href="/join" onClick={handleLinkClick}>{language === 'en' ? 'Join/Contact' : 'Únete/Contáctanos'}</Link></li>
        </ul>
        <div className="language-theme-toggle">
          <button onClick={toggleLanguage} className="language-toggle">
            <GrLanguage className="language-icon" aria-label="Toggle language" />
            <span className="language-text">{language.toUpperCase()}</span>
          </button>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'dark' ? 
              <BsSun className="theme-icon" aria-label="Switch to light mode" /> : 
              <BsMoon className="theme-icon" aria-label="Switch to dark mode" />
            }
          </button>
        </div>
      </nav>
    </header>
  )
}

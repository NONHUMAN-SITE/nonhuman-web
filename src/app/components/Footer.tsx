'use client'
import { FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa'
import { SiHuggingface, SiNotion } from 'react-icons/si'
import { useLanguage } from '../context/LanguageContext'
import { RiTwitterXLine } from "react-icons/ri";
export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/*
          En la versión móvil, la separación entre los íconos de redes sociales 
          se controla mediante la propiedad "gap" en la clase ".social-links" del archivo globals.css.
        */}
        <div className="social-links">
          <a href="https://x.com/0xnonhuman" target="_blank" rel="noopener noreferrer">
            <RiTwitterXLine className="social-icon" />
          </a>
          <a href="https://www.instagram.com/0xnonhuman/" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="social-icon" />
          </a>
          <a href="https://linkedin.com/company/nonhuman" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="social-icon" />
          </a>
          <a href="https://github.com/NONHUMAN-SITE" target="_blank" rel="noopener noreferrer">
            <FaGithub className="social-icon" />
          </a>
          <a href="https://huggingface.co/NONHUMAN-RESEARCH" target="_blank" rel="noopener noreferrer">
            <SiHuggingface className="social-icon" />
          </a>
          <a href="https://malachite-meadow-670.notion.site/NONHUMAN-138c884b65b8802fbd66feb7b223ae3c" target="_blank" rel="noopener noreferrer">
            <SiNotion className="social-icon" />
          </a>
        </div>
        <div className="footer-text">
          <p>NONHUMAN © All Rights Reserved 2025</p>
          <p>{language === 'en' ? 'Understanding new types of intelligence' : 'Entendiendo nuevos tipos de inteligencia'}</p>
        </div>
      </div>
    </footer>
  )
}

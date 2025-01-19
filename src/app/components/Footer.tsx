'use client'
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa'
import { SiHuggingface } from 'react-icons/si'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="footer">
      <div className="social-links">
        <a href="https://twitter.com/nonhuman" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="social-icon" />
        </a>
        <a href="https://instagram.com/nonhuman" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="social-icon" />
        </a>
        <a href="https://linkedin.com/company/nonhuman" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="social-icon" />
        </a>
        <a href="https://github.com/nonhuman" target="_blank" rel="noopener noreferrer">
          <FaGithub className="social-icon" />
        </a>
        <a href="https://huggingface.co/nonhuman" target="_blank" rel="noopener noreferrer">
          <SiHuggingface className="social-icon" />
        </a>
      </div>
      <div className="footer-text">
        <p>NONHUMAN © All Rights Reserved 2025</p>
        <p>{language === 'en' ? 'Understanding new types of intelligence' : 'Entendiendo nuevos tipos de inteligencia'}</p>
      </div>
    </footer>
  )
}

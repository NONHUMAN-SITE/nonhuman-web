'use client'
import Image from 'next/image';
import './style.css';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useEffect } from 'react';
import AnimatedSphere from '@/app/components/AnimatedSphere';

const content = {
  en: {
    title: 'Join',
    description1: 'We are looking for passionate people who love to create, develop and learn. If you are interested in building projects, sharing knowledge, discussing ideas, or simply immersing yourself in the world of AI, this is your place. We are motivated to meet those who share this energy for doing: programming, researching, writing, and bringing ideas to life.',
    description2: 'We want to know about you. Tell us why you are interested and how you can contribute to the group.',
    fullName: 'Full Name',
    email: 'Email',
    statement: 'Statement of Interest',
    statementPlaceholder: 'Why are you interested in joining and what would you contribute?',
    linkedin: 'LinkedIn (optional)',
    submit: 'Submit'
  },
  es: {
    title: 'Únete',
    description1: 'Buscamos personas apasionadas por crear, desarrollar y aprender. Si te interesa construir proyectos, aportar conocimiento, discutir ideas o simplemente sumergirte en el mundo de la IA, este es tu lugar. Nos motiva conocer a quienes comparten esta energía por hacer: programar, investigar, escribir y materializar ideas.',
    description2: 'Queremos saber de ti. Cuéntanos por qué estás interesado y cómo puedes contribuir al grupo.',
    fullName: 'Nombre completo',
    email: 'Correo electrónico',
    statement: 'Statement de interés',
    statementPlaceholder: '¿Por qué estás interesado en unirte y qué aportarías?',
    linkedin: 'LinkedIn (opcional)',
    submit: 'Enviar'
  }
};

export default function Join() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const t = content[language];

  useEffect(() => {
    // Actualiza los colores del formulario según el tema
    const root = document.documentElement;
    if (theme === 'light') {
      root.style.setProperty('--form-border', 'var(--form-border-light)');
      root.style.setProperty('--form-focus', 'var(--form-focus-light)');
    } else {
      root.style.setProperty('--form-border', 'var(--form-border-dark)');
      root.style.setProperty('--form-focus', 'var(--form-focus-dark)');
    }
  }, [theme]);

  return (
    <div className="join-container">
      <div className="join-content">
        <h1 className="join-title">{t.title}</h1>
        
        <div className="join-description">
          <p>{t.description1}</p>
          <p>{t.description2}</p>
        </div>

        <form className="join-form">
          <div className="form-group">
            <label htmlFor="fullName">{t.fullName}</label>
            <input 
              type="text" 
              id="fullName" 
              name="fullName" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">{t.email}</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="statement">{t.statement}</label>
            <textarea 
              id="statement" 
              name="statement" 
              placeholder={t.statementPlaceholder}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="linkedin">{t.linkedin}</label>
            <input 
              type="url" 
              id="linkedin" 
              name="linkedin" 
            />
          </div>

          <button type="submit" className="submit-button">{t.submit}</button>
        </form>
      </div>
      
      {/* Se asigna un tamaño mayor para el contenedor del AnimatedSphere para que la escena sea más ancha y alta */}
      <div className="join-image-container" style={{ width: '800px', height: '800px', marginTop: '50px' }}>
        <AnimatedSphere />
      </div>
    </div>
  );
}

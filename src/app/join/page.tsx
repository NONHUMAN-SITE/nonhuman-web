'use client'
import './style.css';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useState } from 'react';
import AnimatedSphere from '@/app/components/AnimatedSphere';
import AnimatedSphereMobile from '@/app/components/AnimatedSphereMobile';

interface JoinContent {
  title: string;
  description1: string;
  description2: string;
  fullName: string;
  email: string;
  statement: string;
  statementPlaceholder: string;
  linkedin: string;
  submit: string;
}

interface ContactContent {
  title: string;
  description1: string;
  description2: string;
  fullName: string;
  message: string;
  messagePlaceholder: string;
  submit: string;
}

interface ContentType {
  join: JoinContent;
  contact: ContactContent;
}

interface Languages {
  en: ContentType;
  es: ContentType;
}

const content: Languages = {
  en: {
    join: {
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
    contact: {
      title: 'Contact',
      description1: 'If you would like to send us a message and connect with our group, feel free to reach out. We are actively seeking to connect with more individuals, organizations, and companies to help this group grow and thrive.',
      description2: 'Your message could be the beginning of an exciting collaboration.',
      fullName: 'Full Name',
      message: 'Message',
      messagePlaceholder: 'Write your message here...',
      submit: 'Send Message'
    }
  },
  es: {
    join: {
      title: 'Únete',
      description1: 'Buscamos personas apasionadas por crear, desarrollar y aprender. Si te interesa construir proyectos, aportar conocimiento, discutir ideas o simplemente sumergirte en el mundo de la IA, este es tu lugar. Nos motiva conocer a quienes comparten esta energía por hacer: programar, investigar, escribir y materializar ideas.',
      description2: 'Queremos saber de ti. Cuéntanos por qué estás interesado y cómo puedes contribuir al grupo.',
      fullName: 'Nombre completo',
      email: 'Correo electrónico',
      statement: 'Statement de interés',
      statementPlaceholder: '¿Por qué estás interesado en unirte y qué aportarías?',
      linkedin: 'LinkedIn (opcional)',
      submit: 'Enviar'
    },
    contact: {
      title: 'Contáctanos',
      description1: 'Si deseas enviarnos un mensaje y conectar con nuestro grupo, siéntete libre de hacerlo. Actualmente estamos buscando conectar con más personas, organizaciones y empresas para hacer crecer este grupo y potenciar su impacto.',
      description2: 'Tu mensaje podría ser el inicio de una emocionante colaboración.',
      fullName: 'Nombre completo',
      message: 'Mensaje',
      messagePlaceholder: 'Escribe tu mensaje aquí...',
      submit: 'Enviar Mensaje'
    }
  }
};

export default function Join() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [formType, setFormType] = useState<'join' | 'contact'>('join');
  
  // Separamos los contenidos para mejor type checking
  const joinContent = content[language].join;
  const contactContent = content[language].contact;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName');
    const emailBody = formType === 'join' 
      ? `Nombre: ${fullName}
Email: ${formData.get('email')}

Statement:
${formData.get('statement')}

LinkedIn: ${formData.get('linkedin') || 'No proporcionado'}`
      : `Nombre: ${fullName}

Mensaje:
${formData.get('message')}`;

    const subject = formType === 'join' ? '[NONHUMAN POSTULATION]' : '[NONHUMAN CONTACT]';
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=nonhuman.site@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

    window.open(gmailUrl, '_blank');
  };

  const renderJoinForm = () => (
    <>
      <div className="form-group">
        <label htmlFor="fullName">{joinContent.fullName}</label>
        <input 
          type="text" 
          id="fullName" 
          name="fullName" 
          required 
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">{joinContent.email}</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          required 
        />
      </div>
      <div className="form-group">
        <label htmlFor="statement">{joinContent.statement}</label>
        <textarea 
          id="statement" 
          name="statement" 
          placeholder={joinContent.statementPlaceholder}
          required 
        />
      </div>
      <div className="form-group">
        <label htmlFor="linkedin">{joinContent.linkedin}</label>
        <input 
          type="url" 
          id="linkedin" 
          name="linkedin" 
        />
      </div>
    </>
  );

  const renderContactForm = () => (
    <>
      <div className="form-group">
        <label htmlFor="fullName">{contactContent.fullName}</label>
        <input 
          type="text" 
          id="fullName" 
          name="fullName" 
          required 
        />
      </div>
      <div className="form-group">
        <label htmlFor="message">{contactContent.message}</label>
        <textarea 
          id="message" 
          name="message" 
          placeholder={contactContent.messagePlaceholder}
          required 
        />
      </div>
    </>
  );

  return (
    <div className="join-container">
      <div className="join-content">
        <div className="title-container">
          <h1 
            className={`title-option ${formType === 'join' ? 'active' : ''}`}
            onClick={() => setFormType('join')}
          >
            {content[language].join.title}
          </h1>
          <h1 
            className={`title-option ${formType === 'contact' ? 'active' : ''}`}
            onClick={() => setFormType('contact')}
          >
            {content[language].contact.title}
          </h1>
        </div>
        
        <div className="join-description">
          <p>{formType === 'join' ? joinContent.description1 : contactContent.description1}</p>
          <p>{formType === 'join' ? joinContent.description2 : contactContent.description2}</p>
        </div>

        <form className="join-form" onSubmit={handleSubmit}>
          {formType === 'join' ? renderJoinForm() : renderContactForm()}
          <button type="submit" className="submit-button">
            {formType === 'join' ? joinContent.submit : contactContent.submit}
          </button>
        </form>

        {isMobile && (
          <div className="mobile-sphere-container">
            <AnimatedSphereMobile />
          </div>
        )}
      </div>
      
      {!isMobile && (
        <div className="join-image-container" style={{ width: '800px', height: '800px', marginTop: '50px' }}>
          <AnimatedSphere />
        </div>
      )}
    </div>
  );
}

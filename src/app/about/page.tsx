'use client'
import { useLanguage } from '../context/LanguageContext'
import Link from 'next/link'
import './style.css'

export default function About() {
  const { language } = useLanguage()

  const content = {
    en: {
      whoWeAre: "WHO WE ARE?",
      whatWeDo: "WHAT DO WE DO?",
      joinUs: "WANT TO JOIN?",
      description: [
        "We are a technical community passionate about artificial intelligence, ranging from software development to low-level research. Our goal is to bring together people with these profiles to share knowledge, explore the new NONHUMAN intelligence from its foundations and put it into practice through research and development projects.",
        "We firmly believe that AI is one of humanity's greatest advances and we want to be prepared. We seek to expand our knowledge, connect with talent and strengthen the AI ecosystem in Peru.",
        "We recruit people committed to building, researching and developing. We're not here to just talk about technology, we're here to MAKE IT. Build, program, research, develop, make mistakes and learn. Create real projects, drive ideas, take AI beyond theory. If you share this vision, this is your place."
      ],
      articles: {
        title: "Articles",
        description: "We publish guides on specific AI topics, which can range from news writing to paper analysis, framework explanation, and other technical concepts."
      },
      projects: {
        title: "Projects",
        description: "Our community drives initiatives with clear objectives, such as paper implementation, complex topic decomposition, software development, or AI research. We seek to document each step of the process in as much detail as possible, ensuring that the generated knowledge is accessible and replicable."
      }
    },
    es: {
      whoWeAre: "¿QUIÉNES SOMOS?",
      whatWeDo: "¿QUÉ HACEMOS?",
      joinUs: "¿QUIERES SER PARTE?",
      description: [
        "Somos una comunidad técnica apasionada por la inteligencia artificial, abarcando desde el desarrollo de software hasta la investigación de bajo nivel. Nuestro objetivo es reunir a personas con estos perfiles para compartir conocimiento, explorar la nueva inteligencia NONHUMAN desde sus fundamentos y llevarla a la práctica a través de proyectos de investigación y desarrollo.",
        "Creemos firmemente que la IA es uno de los mayores avances de la humanidad y queremos estar preparados. Buscamos expandir nuestro conocimiento, conectar con talento y fortalecer el ecosistema de IA en Perú.",
        "Reclutamos a personas comprometidas con construir, investigar y desarrollar. No estamos aquí para solo hablar de tecnología, estamos aquí para HACERLA. Construir, programar, investigar, desarrollar, equivocarnos y aprender. Crear proyectos reales, impulsar ideas, llevar la IA más allá de la teoría. Si compartes esta visión, este es tu lugar."
      ],
      articles: {
        title: "Artículos",
        description: "Publicamos guías sobre temas específicos de IA, que pueden incluir desde la redacción de noticias hasta el análisis de papers, la explicación de frameworks y otros conceptos técnicos."
      },
      projects: {
        title: "Proyectos",
        description: "Nuestra comunidad impulsa iniciativas con objetivos claros, como la implementación de papers, la descomposición de temas complejos, el desarrollo de software o la investigación en IA. Buscamos documentar cada paso del proceso con el mayor detalle posible, asegurando que el conocimiento generado sea accesible y replicable."
      }
    }
  }

  return (
    <div className="about-container">
      <h1 className="about-title">NONHUMAN</h1>
      <h2 className="about-subtitle">
        {content[language].whoWeAre}
      </h2>
      <div className="about-content">
        {content[language].description.map((paragraph, index) => (
          <p key={index} className="about-paragraph">
            {paragraph}
          </p>
        ))}
      </div>
      
      <div className="section-separator" />
      
      <h2 className="about-subtitle">
        {content[language].whatWeDo}
      </h2>
      <div className="about-content">
        <p className="about-paragraph">
          <Link href="/articles">
            <span className="highlighted-text">{content[language].articles.title}</span>
          </Link>: {content[language].articles.description}
        </p>
        <p className="about-paragraph">
          <Link href="/research">
            <span className="highlighted-text">{content[language].projects.title}</span>
          </Link>: {content[language].projects.description}
        </p>
      </div>

      <Link href="/join" className="join-us-link">
        {content[language].joinUs}
      </Link>
    </div>
  )
}
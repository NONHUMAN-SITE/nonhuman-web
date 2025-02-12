'use client'
import { useLanguage } from '@/app/context/LanguageContext'
import { useTheme } from '@/app/context/ThemeContext'
import { useRouter } from 'next/navigation'
import { FaGithub } from 'react-icons/fa'
import { SiHuggingface } from 'react-icons/si'
import './style.css'
import { useState } from 'react'

export default function SOARM100Page() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const router = useRouter()
  const [selectedSection, setSelectedSection] = useState<'about' | 'content'>('about')

  const aboutEn = `
SO-ARM100 is an open-source initiative that aims to democratize access to intelligent robotics through a low-cost, efficient, and accessible approach. Our goal is to provide a platform that facilitates experimentation and learning at the intersection of robotics and deep learning, eliminating the technical and economic barriers that often limit entry into this field.

Inspired by the work developed by Hugging Face, particularly their LeRobot repository (https://github.com/huggingface/lerobot), we have designed SO-ARM100 as an accessible and well-documented alternative, allowing anyone interested to replicate and understand the construction and training of autonomous robots. Through this project, we offer a detailed guide on implementation, including both software and hardware design, optimizing costs without compromising performance.

Our research is based on an exhaustive analysis of the most relevant papers in the field of robot training through deep learning. In the following sections, we detail these studies, explain their theoretical principles, and show their practical application through code implementations, ensuring a comprehensive understanding of the methods used in the development of modern robotic systems.

Additionally, we share key recommendations for hardware selection, aiming to maximize efficiency in terms of cost and performance. We explore optimization strategies in components such as motors, sensors, and processing units, ensuring that available resources are used as effectively as possible.

With SO-ARM100, we seek to accelerate the adoption of intelligent robotics, facilitating access to essential technical knowledge and providing a clear roadmap for those who wish to start in this field. We believe this project represents a solid starting point for researchers, developers, and enthusiasts who want to explore the convergence between robotics and deep learning, without the limitations that often accompany these developments.
  `

  const aboutEs = `

SO-ARM100 es una iniciativa de código abierto que busca democratizar el acceso a la robótica inteligente mediante un enfoque low-cost, eficiente y accesible. Nuestro objetivo es proporcionar una plataforma que facilite la experimentación y el aprendizaje en la intersección entre robótica y deep learning, eliminando las barreras técnicas y económicas que suelen limitar la entrada a este campo.

Inspirados en el trabajo desarrollado por Hugging Face, en particular su repositorio LeRobot (https://github.com/huggingface/lerobot), hemos diseñado SO-ARM100 como una alternativa accesible y bien documentada, permitiendo que cualquier persona interesada pueda replicar y comprender la construcción y entrenamiento de robots autónomos. A través de este proyecto, ofrecemos una guía detallada sobre la implementación del sistema, incluyendo tanto la parte software como el diseño hardware, optimizando costos sin comprometer el rendimiento.

Nuestra investigación se fundamenta en un análisis exhaustivo de los papers más relevantes en el campo del entrenamiento de robots mediante aprendizaje profundo. En las siguientes secciones, desglosamos estos estudios, explicamos sus principios teóricos y mostramos su aplicación práctica a través de implementaciones en código, asegurando una comprensión integral de los métodos empleados en el desarrollo de sistemas robóticos modernos.

Adicionalmente, compartimos recomendaciones clave para la selección de hardware, con el objetivo de maximizar la eficiencia en términos de costo y desempeño. Exploramos estrategias de optimización en componentes como motores, sensores y unidades de procesamiento, asegurando que los recursos disponibles sean utilizados de la manera más efectiva posible.

Con SO-ARM100, buscamos acelerar la adopción de la robótica inteligente, facilitando el acceso al conocimiento técnico esencial y proporcionando una hoja de ruta clara para quienes desean iniciarse en este campo. Creemos que este proyecto representa un punto de partida sólido para investigadores, desarrolladores y entusiastas que desean explorar la convergencia entre robótica y aprendizaje profundo, sin las limitaciones que suelen acompañar a estos desarrollos.`

  const aboutContent = {
    en: aboutEn,
    es: aboutEs
  }

  const roadmapItems = [
    {
      title: language === 'en' ? '1. Construction' : '1. Construcción',
      subItems: [
        { 
          id: '1.1', 
          name: 'Building SO-ARM100',
          completed: false,
          description: language === 'en' 
            ? "Detailed documentation of the SO-ARM100 robotic arm construction process, including hardware specifications and assembly guidelines."
            : "Documentación detallada del proceso de construcción del brazo robótico SO-ARM100, incluyendo especificaciones de hardware y guías de ensamblaje."
        }
      ]
    },
    {
      title: language === 'en' ? '2. Training Papers' : '2. Papers para entrenar',
      subItems: [
        { 
          id: '2.1', 
          name: 'Training with Action Chunking Transformers',
          completed: true,
          description: language === 'en'
            ? "Implementation and analysis of Action Chunking Transformers for efficient robotic control and task execution."
            : "Implementación y análisis de Action Chunking Transformers para el control robótico eficiente y la ejecución de tareas."
        }
      ]
    }
  ]

  const handleItemClick = (itemId: string) => {
    router.push(`/research/wiki/SO-ARM100/${itemId}`)
  }

  return (
    <div className={`wiki-content ${theme} mind-page-layout`}>
      <h1 className="mind-title space-mono-bold">SO-ARM100</h1>
      
      <div className="floating-project-links">
        <a 
          href="https://github.com/NONHUMAN-SITE" 
          target="_blank" 
          rel="noopener noreferrer"
          className="floating-project-link"
        >
          <FaGithub className="floating-project-icon" />
        </a>
        <a 
          href="https://huggingface.co/NONHUMAN-RESEARCH" 
          target="_blank" 
          rel="noopener noreferrer"
          className="floating-project-link"
        >
          <SiHuggingface className="floating-project-icon" />
        </a>
      </div>

      <div className="mind-filters-container">
        <button 
          className={`mind-selector-button ${selectedSection === 'about' ? 'active' : ''}`}
          onClick={() => setSelectedSection('about')}
        >
          About
        </button>
        <button 
          className={`mind-selector-button ${selectedSection === 'content' ? 'active' : ''}`}
          onClick={() => setSelectedSection('content')}
        >
          Content
        </button>
      </div>

      <div className="roadmap-index">
        {selectedSection === 'about' ? (
          <div className="about-content">
            <p>{language === 'en' ? aboutContent.en : aboutContent.es}</p>
          </div>
        ) : (
          <>
            {roadmapItems.map((section) => (
              <div key={section.title} className="index-section">
                <div className="index-header">
                  <div className="index-title space-mono-bold">{section.title}</div>
                </div>
                {section.subItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="index-subitem space-mono-regular clickable"
                    onClick={() => handleItemClick(item.id)}
                  >
                    <div className="subitem-content">
                      <span>{item.id} {item.name}</span>
                      {!item.completed && (
                        <span className="status-badge">
                          {language === 'en' ? 'Under development' : 'En desarrollo'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>

      {selectedSection === 'content' && (
        <div className="content-grid">
          {roadmapItems.flatMap((section) =>
            section.subItems.map((item) => (
              <div 
                key={item.id} 
                className="content-card clickable"
                onClick={() => handleItemClick(item.id)}
              >
                <div className="card-header">
                  <h3 className="card-title space-mono-bold">
                    {item.id} {item.name}
                  </h3>
                  {!item.completed && (
                    <span className="status-badge">
                      {language === 'en' ? 'Under development' : 'En desarrollo'}
                    </span>
                  )}
                </div>
                <p className="card-description">
                  {item.description}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}















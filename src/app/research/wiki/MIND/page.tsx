'use client'
import { useLanguage } from '@/app/context/LanguageContext'
import { useTheme } from '@/app/context/ThemeContext'
import { useRouter } from 'next/navigation'
import './style.css'
import { useState } from 'react'

export default function MINDPage() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const router = useRouter()
  const [selectedSection, setSelectedSection] = useState<'about' | 'content'>('about')

  const aboutEn = `MIND is a comprehensive research project dedicated to the deep understanding and development of advanced language models. Our initiative not only addresses the theoretical foundations that underpin this technology but also explores its evolution over time, breaking down the key contributions that have defined the state of the art in artificial intelligence.

Through a rigorous approach, we analyze in detail the most influential papers in the development of neural network-driven language models. Our goal is not only to understand these advancements but also to translate them into practical implementations, demonstrating how theoretical concepts can materialize in code.

Our research spans from the mathematical foundations of these models to their architectural structures, training algorithms, optimization techniques, and evaluation strategies. We delve into topics such as tokenization, embeddings, attention mechanisms, pretraining, and fine-tuning, exploring each with the necessary depth to understand their impact on model performance and generalization capabilities.

Moreover, MIND is not limited to theory: we develop our own implementations, replicate benchmark experiments, and optimize existing models to generate new knowledge and actively contribute to the AI research community. We focus on the engineering behind these systems, analyzing computational challenges, training efficiency, scalability, and practical applications across various domains.

This project represents a deep exploration of one of the most influential technologies of our era, with the goal of not only understanding it but also advancing its development and democratizing its knowledge.`

  const aboutEs = `MIND es un proyecto de investigación integral dedicado a la comprensión profunda y el desarrollo de modelos de lenguaje avanzados. Nuestra iniciativa no solo aborda los fundamentos teóricos que sustentan esta tecnología, sino que también explora su evolución a lo largo del tiempo, desglosando las contribuciones clave que han definido el estado del arte en inteligencia artificial.

A través de un enfoque riguroso, analizamos en detalle los papers más influyentes en el desarrollo de los modelos de lenguaje impulsados por redes neuronales. No solo buscamos entender estos avances, sino también traducirlos en implementaciones prácticas, demostrando cómo los conceptos teóricos pueden materializarse en código.

Nuestra investigación abarca desde las bases matemáticas de estos modelos hasta sus estructuras arquitectónicas, algoritmos de entrenamiento, técnicas de optimización y estrategias de evaluación. Profundizamos en temas como tokenización, embeddings, mecanismos de atención, preentrenamiento y ajuste fino, explorando cada uno con el nivel de detalle necesario para comprender su impacto en el rendimiento y la capacidad de generalización de los modelos.

Además, MIND no se limita a la teoría: desarrollamos implementaciones propias, replicamos experimentos de referencia y optimizamos modelos existentes, con el fin de generar nuevo conocimiento y contribuir activamente a la comunidad de investigación en IA. Nos enfocamos en la ingeniería detrás de estos sistemas, analizando desafíos computacionales, eficiencia de entrenamiento, escalabilidad y aplicaciones prácticas en diversos ámbitos.

Este proyecto representa una exploración profunda de una de las tecnologías más influyentes de nuestra era, con el objetivo de no solo entenderla, sino también de avanzar en su desarrollo y democratizar su conocimiento.`

  const aboutContent = {
    en: aboutEn,
    es: aboutEs
  }

  const roadmapItems = [
    {
      title: language === 'en' ? '1. Fundamentals' : '1. Fundamentos',
      completed: true,
      subItems: [
        { 
          id: '1.1', 
          name: 'Attention is all you need',
          description: language === 'en' 
            ? "Study of the fundamental paper that introduced the Transformer architecture. This is one of the most important papers in the development of current language models."
            : "Estudio del paper fundamental que introdujo la arquitectura Transformer. Este es uno de los papers más importantes en el desarrollo de los modelos de lenguaje actuales."
        },
        { 
          id: '1.2', 
          name: 'Implementation',
          description: language === 'en'
            ? "Practical implementation of a basic language model. We will detail with code and explanation how to implement a basic language model using transformers."
            : "Implementación práctica de un modelo de lenguaje básico. Detallaremos con código y explicación como se puede implementar un modelo de lenguaje básico usando transformers."
        }
      ]
    },
    {
      title: language === 'en' ? '2. Assistant' : '2. Asistente',
      completed: false,
      subItems: [
        { 
          id: '2.2', 
          name: 'RLHF',
          description: language === 'en'
            ? "In-depth exploration of Reinforcement Learning from Human Feedback: reward modeling, policy optimization, PPO implementation, and practical challenges in alignment training."
            : "Exploración detallada del Aprendizaje por Refuerzo con Feedback Humano: modelado de recompensas, optimización de políticas, implementación de PPO y desafíos prácticos en el entrenamiento de alineación."
        },
        { 
          id: '2.3', 
          name: 'DPO',
          description: language === 'en'
            ? "Detailed analysis of Direct Preference Optimization: theoretical foundations, implementation methodology, and real-world applications in model alignment."
            : "Análisis detallado de Direct Preference Optimization: fundamentos teóricos, metodología de implementación y aplicaciones prácticas en la alineación de modelos."
        }
      ]
    },
    {
      title: language === 'en' ? '3. Optimization' : '3. Optimización',
      completed: false,
      subItems: [
        { 
          id: '3.1', 
          name: 'LoRA',
          description: language === 'en'
            ? "Comprehensive study of Low-Rank Adaptation: theory, implementation details, and practical applications in model customization."
            : "Estudio completo de Low-Rank Adaptation: teoría, detalles de implementación y aplicaciones prácticas en la personalización de modelos."
        },
        { 
          id: '3.2', 
          name: 'Scaling Laws',
          description: language === 'en'
            ? "Comprehensive review of language model scaling laws: computational requirements, parameter scaling efficiency, and practical implications."
            : "Revisión exhaustiva de las leyes de escalado en modelos de lenguaje: requerimientos computacionales, eficiencia del escalado de parámetros e implicaciones prácticas."
        }
      ]
    },
    {
      title: language === 'en' ? '4. Data' : '4. Datos',
      completed: false,
      subItems: [
        { 
          id: '4.1', 
          name: 'Training Data and Benchmarks',
          description: language === 'en'
            ? "Deep dive into data processing, dataset types, evaluation frameworks, and comprehensive analysis of model capabilities."
            : "Análisis profundo del procesamiento de datos, tipos de datasets, frameworks de evaluación y análisis comprensivo de las capacidades del modelo."
        }
      ]
    },
    {
      title: language === 'en' ? '5. Architectures' : '5. Arquitecturas',
      completed: false,
      subItems: [
        { 
          id: '5.1', 
          name: 'MOE',
          description: language === 'en'
            ? "Deep dive into Mixture of Experts architecture: expert network design, routing mechanisms, and practical implementation."
            : "Análisis profundo de la arquitectura Mixture of Experts: diseño de redes expertas, mecanismos de enrutamiento e implementación práctica."
        },
        { 
          id: '5.2', 
          name: 'VLM',
          description: language === 'en'
            ? "Comprehensive study of Vision Language Models: multimodal architectures, vision encoders, and cross-attention mechanisms."
            : "Estudio completo de Vision Language Models: arquitecturas multimodales, codificadores de visión y mecanismos de atención cruzada."
        },
        { 
          id: '5.3', 
          name: 'Qwen2-Audio',
          description: language === 'en'
            ? "In-depth exploration of Qwen2-Audio: audio processing, speech recognition, and practical applications."
            : "Exploración detallada de Qwen2-Audio: procesamiento de audio, reconocimiento de voz y aplicaciones prácticas."
        }
      ]
    },
    {
      title: language === 'en' ? '6. Reasoning models' : '6. Modelos de razonamiento',
      completed: false,
      subItems: [
        { 
          id: '6.1', 
          name: 'Deepseek Math',
          description: language === 'en'
            ? "Analysis of mathematical reasoning capabilities in language models and their applications."
            : "Análisis de las capacidades de razonamiento matemático en modelos de lenguaje y sus aplicaciones."
        },
        { 
          id: '6.2', 
          name: 'Deepseek R1',
          description: language === 'en'
            ? "Study of advanced reasoning techniques and their implementation in language models."
            : "Estudio de técnicas avanzadas de razonamiento y su implementación en modelos de lenguaje."
        },
        { 
          id: '6.3', 
          name: 'Road to O1',
          description: language === 'en'
            ? "Comprehensive strategic plan for achieving artificial general intelligence objectives."
            : "Plan estratégico integral para alcanzar objetivos de inteligencia artificial general."
        }
      ]
    }
  ]

  const handleItemClick = (itemId: string) => {
    router.push(`/research/wiki/MIND/${itemId}`)
  }

  return (
    <div className={`wiki-content ${theme} mind-page-layout`}>
      <h1 className="mind-title space-mono-bold">MIND</h1>
      
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
                  {!section.completed && (
                    <span className="status-badge">
                      {language === 'en' ? 'Under development' : 'En desarrollo'}
                    </span>
                  )}
                </div>
                {section.subItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="index-subitem space-mono-regular clickable"
                    onClick={() => handleItemClick(item.id)}
                  >
                    {item.id} {item.name}
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
                  {!section.completed && (
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















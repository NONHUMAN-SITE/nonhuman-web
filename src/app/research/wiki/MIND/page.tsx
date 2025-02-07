'use client'
import { useLanguage } from '@/app/context/LanguageContext'
import { useRouter, usePathname } from 'next/navigation'
import './style.css'

export default function MINDPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const isSlugPage = pathname.includes('/MIND/') && pathname.split('/MIND/').length > 1

  const roadmapItems = [
    {
      title: '1. Fundamentals',
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
      title: '2. Assistant',
      completed: false,
      subItems: [
        { 
          id: '2.1', 
          name: 'Data (Tokenizer, tipos de dataset)',
          description: language === 'en'
            ? "Deep dive into data processing for language models: tokenization methods (BPE, WordPiece, SentencePiece), dataset types (instruction tuning, conversation, code), data cleaning and preprocessing techniques, and best practices for dataset creation and curation."
            : "Análisis profundo del procesamiento de datos para modelos de lenguaje: métodos de tokenización (BPE, WordPiece, SentencePiece), tipos de datasets (instruction tuning, conversación, código), técnicas de limpieza y preprocesamiento, y mejores prácticas para la creación y curación de datasets."
        },
        { 
          id: '2.2', 
          name: 'LoRA',
          description: language === 'en'
            ? "Comprehensive study of Low-Rank Adaptation (LoRA): theory behind parameter-efficient fine-tuning, implementation details, rank selection, adapter fusion techniques, and practical applications in model customization with minimal computational resources."
            : "Estudio completo de Low-Rank Adaptation (LoRA): teoría detrás del fine-tuning eficiente en parámetros, detalles de implementación, selección de rango, técnicas de fusión de adaptadores y aplicaciones prácticas en la personalización de modelos con recursos computacionales mínimos."
        },
        { 
          id: '2.3', 
          name: 'RLHF',
          description: language === 'en'
            ? "In-depth exploration of Reinforcement Learning from Human Feedback: reward modeling, policy optimization, PPO implementation, human feedback collection strategies, and practical challenges in alignment training. Includes case studies from successful RLHF implementations."
            : "Exploración detallada del Aprendizaje por Refuerzo con Feedback Humano: modelado de recompensas, optimización de políticas, implementación de PPO, estrategias de recolección de feedback humano y desafíos prácticos en el entrenamiento de alineación. Incluye casos de estudio de implementaciones exitosas de RLHF."
        },
        { 
          id: '2.4', 
          name: 'DPO',
          description: language === 'en'
            ? "Detailed analysis of Direct Preference Optimization: theoretical foundations, comparison with RLHF, implementation methodology, preference dataset creation, training strategies, and real-world applications in model alignment without reward modeling."
            : "Análisis detallado de Direct Preference Optimization: fundamentos teóricos, comparación con RLHF, metodología de implementación, creación de datasets de preferencias, estrategias de entrenamiento y aplicaciones prácticas en la alineación de modelos sin modelado de recompensas."
        },
        { 
          id: '2.5', 
          name: 'Scaling Laws',
          description: language === 'en'
            ? "Comprehensive review of language model scaling laws: computational requirements, parameter scaling efficiency, dataset size relationships, training dynamics, performance predictions, and practical implications for model development and deployment."
            : "Revisión exhaustiva de las leyes de escalado en modelos de lenguaje: requerimientos computacionales, eficiencia del escalado de parámetros, relaciones con el tamaño del dataset, dinámica de entrenamiento, predicciones de rendimiento e implicaciones prácticas para el desarrollo y despliegue de modelos."
        }
      ]
    },
    {
      title: language === 'en' ? '3. Validation' : '3. Validación',
      completed: false,
      subItems: [
        { 
          id: '3.1', 
          name: 'benchmarks (MMLU, ETC)',
          description: language === 'en'
            ? "Extensive coverage of language model evaluation: MMLU (massive multitask language understanding), TruthfulQA, HumanEval, HELM framework, custom benchmark creation, and comprehensive analysis of model capabilities across different domains and tasks."
            : "Cobertura extensiva de la evaluación de modelos de lenguaje: MMLU (comprensión masiva multitarea), TruthfulQA, HumanEval, framework HELM, creación de benchmarks personalizados y análisis comprensivo de las capacidades del modelo en diferentes dominios y tareas."
        }
      ]
    },
    {
      title: language === 'en' ? '4. New Architectures' : '4. Nuevas arquitecturas',
      completed: false,
      subItems: [
        { 
          id: '4.1', 
          name: 'MOE',
          description: language === 'en'
            ? "Deep dive into Mixture of Experts architecture: expert network design, routing mechanisms, conditional computation, training strategies, scaling considerations, and practical implementation of sparse models for improved efficiency and performance."
            : "Análisis profundo de la arquitectura Mixture of Experts: diseño de redes expertas, mecanismos de enrutamiento, computación condicional, estrategias de entrenamiento, consideraciones de escalado e implementación práctica de modelos dispersos para mejorar la eficiencia y el rendimiento."
        },
        { 
          id: '4.2', 
          name: 'VLM',
          description: language === 'en'
            ? "Comprehensive study of Vision Language Models: multimodal architectures, vision encoders, cross-attention mechanisms, training strategies for image-text alignment, and applications in various tasks including image understanding, generation, and manipulation."
            : "Estudio completo de Vision Language Models: arquitecturas multimodales, codificadores de visión, mecanismos de atención cruzada, estrategias de entrenamiento para alineación imagen-texto y aplicaciones en diversas tareas incluyendo comprensión, generación y manipulación de imágenes."
        },
        { 
          id: '4.3', 
          name: 'SPEECH 2 SPEECH',
          description: language === 'en'
            ? "In-depth exploration of direct speech-to-speech models: audio processing, voice conversion techniques, prosody transfer, multilingual capabilities, real-time processing considerations, and practical applications in voice synthesis and translation."
            : "Exploración detallada de modelos directos de voz a voz: procesamiento de audio, técnicas de conversión de voz, transferencia de prosodia, capacidades multilingües, consideraciones de procesamiento en tiempo real y aplicaciones prácticas en síntesis y traducción de voz."
        }
      ]
    },
    {
      title: '5. O1',
      completed: false,
      subItems: [
        { 
          id: '5.1', 
          name: 'Roadmap to O1',
          description: language === 'en'
            ? "Comprehensive strategic plan for achieving O1: technical requirements analysis, infrastructure planning, resource optimization, scalability considerations, implementation phases, and success metrics for reaching artificial general intelligence objectives."
            : "Plan estratégico integral para alcanzar O1: análisis de requerimientos técnicos, planificación de infraestructura, optimización de recursos, consideraciones de escalabilidad, fases de implementación y métricas de éxito para alcanzar objetivos de inteligencia artificial general."
        }
      ]
    }
  ]

  const handleItemClick = (itemId: string) => {
    router.push(`/research/wiki/MIND/${itemId}`)
  }

  return (
    <div className="wiki-content">
      <div className="roadmap-container">
        <h1 className="roadmap-title space-mono-bold">ROADMAP</h1>
        
        <div className="roadmap-index">
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
        </div>

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
      </div>
    </div>
  )
}















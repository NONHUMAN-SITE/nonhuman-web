'use client'
import { useLanguage } from '@/app/context/LanguageContext'
import GameOfLife from '@/app/components/GameOfLife'
import './style.css'

export default function MINDPage() {
  const { language } = useLanguage()

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
          name: 'GPT2 (nanoGPT) (software)',
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
            ? "Data processing and types of training datasets."
            : "Procesamiento de datos y tipos de datasets para entrenamiento."
        },
        { 
          id: '2.2', 
          name: 'LoRA',
          description: language === 'en'
            ? "Efficient fine-tuning technique for large models."
            : "Técnica de fine-tuning eficiente para modelos grandes."
        },
        { 
          id: '2.3', 
          name: 'RLHF',
          description: language === 'en'
            ? "Reinforcement Learning from Human Feedback."
            : "Aprendizaje por refuerzo con feedback humano."
        },
        { 
          id: '2.4', 
          name: 'DPO',
          description: language === 'en'
            ? "Direct Preference Optimization for model alignment."
            : "Direct Preference Optimization para alineación de modelos."
        },
        { 
          id: '2.5', 
          name: 'Scaling Laws',
          description: language === 'en'
            ? "Scaling laws in language models."
            : "Leyes de escalado en modelos de lenguaje."
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
            ? "Standard metrics and tests for model evaluation."
            : "Métricas y pruebas estándar para evaluación de modelos."
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
            ? "Mixture of Experts: architecture for more efficient models."
            : "Mixture of Experts: arquitectura para modelos más eficientes."
        },
        { 
          id: '4.2', 
          name: 'VLM',
          description: language === 'en'
            ? "Vision Language Models: multimodal models."
            : "Vision Language Models: modelos multimodales."
        },
        { 
          id: '4.3', 
          name: 'SPEECH 2 SPEECH',
          description: language === 'en'
            ? "Direct voice-to-voice conversion models."
            : "Modelos de conversión directa voz a voz."
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
            ? "Strategic plan to achieve O1 objective."
            : "Plan estratégico para alcanzar el objetivo O1."
        }
      ]
    }
  ]

  return (
    <>
      <GameOfLife 
        cellSize={30}
        updateSpeed={2000}
        initialActiveCells={100}
        reloadInterval={10000}
        spreadRadius={20}
      />
      <div className="roadmap-container">
        <h1 className="roadmap-title space-mono-bold">ROADMAP</h1>
        
        {/* Índice */}
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
                <div key={item.id} className="index-subitem space-mono-regular">
                  {item.id} {item.name}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Contenido con cards */}
        <div className="content-grid">
          {roadmapItems.flatMap((section) =>
            section.subItems.map((item) => (
              <div key={item.id} className="content-card">
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
    </>
  )
}















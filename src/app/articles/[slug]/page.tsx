'use client'
import { useParams } from 'next/navigation'
import { useLanguage } from '@/app/context/LanguageContext'
import { useTheme } from '@/app/context/ThemeContext'
import { useEffect, useState } from 'react'
import MarkdownRenderer from '@/app/projects/components/MarkdownRenderer'
import SidebarWiki from '@/app/projects/components/SidebarWiki'
import '../style.css'

interface ArticleMetadata {
  [key: string]: {
    title: string;
    description: string;
    authors: string;
    date: string;
    url: string;
    tags?: string[];
  }
}

const slugify = (str: string) => {
  const normalized = str
    .replace(/[áàäâã]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöôõ]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ÁÀÄÂÃ]/g, 'a')
    .replace(/[ÉÈËÊ]/g, 'e')
    .replace(/[ÍÌÏÎ]/g, 'i')
    .replace(/[ÓÒÖÔÕ]/g, 'o')
    .replace(/[ÚÙÜÛ]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/Ñ/g, 'n')

  return normalized
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export default function ArticlePage() {
  const params = useParams()
  const { language } = useLanguage()
  const { theme } = useTheme()
  const id = params.slug as string
  const [content, setContent] = useState<string>('')
  const [metadata, setMetadata] = useState<ArticleMetadata | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Añadir detector de mobile
  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    updateIsMobile()
    window.addEventListener('resize', updateIsMobile)
    return () => window.removeEventListener('resize', updateIsMobile)
  }, [])

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Obtenemos los metadatos del artículo
        const metadataResponse = await fetch(`/articles/${id}/metadata.json`)
        const articleData: ArticleMetadata = await metadataResponse.json()
        setMetadata(articleData)

        // Cargamos el contenido según el idioma
        const contentPath = articleData[language].url
        const contentResponse = await fetch(`/${contentPath}`)
        const text = await contentResponse.text()
        setContent(text)
      } catch (error) {
        console.error('Error loading article:', error)
        setContent(language === 'en'
          ? '# Error\nArticle not found or error loading the content.'
          : '# Error\nArtículo no encontrado o error al cargar el contenido.'
        )
      }
    }

    fetchContent()
  }, [id, language])

  // No necesitamos formatear la fecha ya que viene formateada del JSON
  const currentLanguageData = metadata?.[language]

  return (
    <div className={`wiki-layout ${theme}`}>
      <div className="article-content">
        {currentLanguageData && (
          <div className="article-metadata-header">
            <h1 className="article-page-title">{currentLanguageData.title}</h1>
            <p className="article-page-description">{currentLanguageData.description}</p>
            <div className="article-page-info">
              <span>{currentLanguageData.authors}</span>
              <span>{currentLanguageData.date}</span>
            </div>
          </div>
        )}
        <MarkdownRenderer 
          content={content}
          options={{ slugify }}
        />
      </div>
      {!isMobile && (
        <SidebarWiki 
          content={content}
          slugify={slugify}
        />
      )}
    </div>
  )
}
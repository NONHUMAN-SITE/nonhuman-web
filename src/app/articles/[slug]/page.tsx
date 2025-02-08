'use client'
import { useParams } from 'next/navigation'
import { useLanguage } from '@/app/context/LanguageContext'
import { useTheme } from '@/app/context/ThemeContext'
import { useEffect, useState } from 'react'
import MarkdownRenderer from '@/app/research/components/MarkdownRenderer'
import SidebarWiki from '@/app/research/components/SidebarWiki'
import '../style.css'

interface ArticleMetadata {
  title_english: string;
  title_spanish: string;
  description_english: string;
  description_spanish: string;
  author: string;
  date: string;
  tags: string[];
  article_english: string;
  article_spanish: string;
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

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Obtenemos los metadatos del artículo
        const metadataResponse = await fetch(`/articles/${id}/metadata.json`)
        const articleData: ArticleMetadata = await metadataResponse.json()
        setMetadata(articleData)

        // Cargamos el contenido según el idioma
        const contentPath = language === 'en'
          ? `/articles/${id}/article.en.md`
          : `/articles/${id}/article.es.md`

        const contentResponse = await fetch(contentPath)
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

  // Formato de fecha similar a la wiki
  const formattedDate = metadata?.date
    ? new Date(metadata.date).toLocaleDateString(
        language === 'en' ? 'en-US' : 'es-ES',
        { year: 'numeric', month: 'long', day: 'numeric' }
      )
    : ''

  // Seleccionamos título y descripción según el idioma
  const title = language === 'en' ? metadata?.title_english : metadata?.title_spanish
  const description = language === 'en'
    ? metadata?.description_english
    : metadata?.description_spanish

  return (
    <div className={`wiki-layout ${theme}`}>
      <div className="content-container">
        {metadata && (
          <div className="content-metadata">
            <h1>{title}</h1>
            <p className="metadata-description">{description}</p>
            <div className="metadata-info">
              <span>{metadata.author}</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        )}
        <MarkdownRenderer 
          content={content}
          options={{ slugify }}
        />
      </div>
      <SidebarWiki 
        content={content}
        slugify={slugify}
      />
    </div>
  )
}
'use client'
import { useParams } from 'next/navigation'
import { useLanguage } from '@/app/context/LanguageContext'
import { useEffect, useState } from 'react'
import MarkdownRenderer from '@/app/research/components/MarkdownRenderer'

export default function MINDContentPage() {
  const params = useParams()
  const { language } = useLanguage()
  const slug = params.slug as string
  const [content, setContent] = useState<string>('')

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/wiki/MIND/${slug}.md`)
        const text = await response.text()
        setContent(text)
      } catch (error) {
        console.error('Error loading markdown content:', error)
        setContent(language === 'en' 
          ? '# Error\nContent not found or error loading the page.'
          : '# Error\nContenido no encontrado o error al cargar la página.'
        )
      }
    }

    fetchContent()
  }, [slug, language])

  return (
    <div className="content-container">
      <MarkdownRenderer content={content} />
    </div>
  )
}

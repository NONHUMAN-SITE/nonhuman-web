'use client'
import { useParams } from 'next/navigation'
import { useLanguage } from '@/app/context/LanguageContext'
import { useEffect, useState } from 'react'
import MarkdownRenderer from '@/app/research/components/MarkdownRenderer'
import SidebarWiki from '@/app/research/components/SidebarWiki'
import '../style.css'

const slugify = (str: string) => {
  // Primero normalizamos el string y reemplazamos caracteres especiales
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
    .replace(/Ñ/g, 'n');

  // Luego aplicamos las transformaciones estándar
  return normalized
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Solo letras, números, espacios y guiones
    .replace(/\s+/g, '-')     // Espacios a guiones
    .replace(/-+/g, '-')      // Eliminar guiones múltiples
    .replace(/^-+/, '')       // Eliminar guiones del inicio
    .replace(/-+$/, '');      // Eliminar guiones del final
};

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
    <div className="wiki-layout">
      <div className="content-container">
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

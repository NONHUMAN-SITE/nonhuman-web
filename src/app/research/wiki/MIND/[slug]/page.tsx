'use client'
import { useParams } from 'next/navigation'
import { useLanguage } from '@/app/context/LanguageContext'

export default function MINDContentPage() {
  const params = useParams()
  const { language } = useLanguage()
  const slug = params.slug as string

  return (
    <div className="content-page">
      <h1>Content for section {slug}</h1>
      {/* Aquí puedes renderizar el contenido específico basado en el slug */}
    </div>
  )
}

'use client'
import Link from 'next/link'
import { useLanguage } from '@/app/context/LanguageContext'

interface ArticleCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  author: string;
}

export default function ArticleCard({
  id,
  title,
  description,
  date,
  tags,
  author
}: ArticleCardProps) {
  const { language } = useLanguage()
  
  // Formatear la fecha según el idioma
  const formattedDate = new Date(date).toLocaleDateString(
    language === 'en' ? 'en-US' : 'es-ES',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )
  
  return (
    <Link href={`/articles/${id}`} className="article-card">
      <div className="article-header">
        <h2 className="article-title">{title}</h2>
        <div className="article-metadata">
          <span>{author}</span>
          <span>{formattedDate}</span>
        </div>
      </div>
      <p className="article-description">{description}</p>
      <div className="article-tags">
        {tags.map((tag) => (
          <span key={tag} className="tag-badge">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}

'use client'
import { useState } from 'react'
import { useLanguage } from '@/app/context/LanguageContext'
import { useTheme } from '@/app/context/ThemeContext'
import ArticleCard from './components/ArticleCard'
import './style.css'

export default function ArticlesPage() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')

  // Example articles data
  const articles = [
    {
      title: "Understanding Transformer Architecture",
      description: "A deep dive into the architecture that revolutionized natural language processing, exploring its key components and mechanisms.",
      date: "2024-03-15",
      tags: ["AI", "NLP", "Transformers"],
      author: "Maria García"
    },
    {
      title: "Implementing RLHF: A Practical Guide",
      description: "Step-by-step guide on implementing Reinforcement Learning from Human Feedback, with code examples and best practices.",
      date: "2024-03-10",
      tags: ["RLHF", "Machine Learning", "Implementation"],
      author: "John Smith"
    },
    {
      title: "The Future of Vision Language Models",
      description: "Exploring the latest developments in multimodal AI and their potential impact on future applications.",
      date: "2024-03-05",
      tags: ["VLM", "Computer Vision", "AI"],
      author: "Alex Johnson"
    }
  ]

  const tags = ["all", "AI", "NLP", "Transformers", "RLHF", "Machine Learning", "VLM", "Computer Vision"]

  return (
    <div className="articles-container">
      <h1 className="articles-title space-mono-bold">
        {language === 'en' ? 'ARTICLES' : 'ARTÍCULOS'}
      </h1>
      
      <div className="filters-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder={language === 'en' ? 'Search articles...' : 'Buscar artículos...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <select 
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="tag-select"
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag === 'all' ? (language === 'en' ? 'All Tags' : 'Todas las Etiquetas') : tag}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-select"
        >
          <option value="newest">
            {language === 'en' ? 'Newest First' : 'Más Recientes'}
          </option>
          <option value="oldest">
            {language === 'en' ? 'Oldest First' : 'Más Antiguos'}
          </option>
        </select>
      </div>

      <div className="articles-grid">
        {articles.map((article, index) => (
          <ArticleCard
            key={index}
            {...article}
          />
        ))}
      </div>
    </div>
  )
}

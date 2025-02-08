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
      id: "000001",
      title_english: "Langraph Tutorial #1: Introduction to Langraph",
      title_spanish: "Tutorial de Langraph #1: Introducción a Langraph",
      description_english: "Tutorial on the Langraph framework for handling agents and LLMs",
      description_spanish: "Tutorial del framework de Langraph para el manejo de agentes y LLMs",
      date: "2025-02-09",
      tags: ["Agents", "LLM", "Langraph"],
      author: "Leonardo Pérez",
      article_english: "/articles/000001/article.en.md",
      article_spanish: "/articles/000001/article.es.md"
    }
  ]

  const tags = ["all", "Agents", "LLM", "Langraph","VLM","World Models"]

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
            id={article.id}
            title={language === 'en' ? article.title_english : article.title_spanish}
            description={language === 'en' ? article.description_english : article.description_spanish}
            date={article.date}
            tags={article.tags}
            author={article.author}
          />
        ))}
      </div>
    </div>
  )
}

'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useLanguage } from '@/app/context/LanguageContext'
import ArticleCard from './components/ArticleCard'
import './style.css'

export default function ArticlesPage() {
  const { language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false)
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const tagDropdownRef = useRef<HTMLDivElement>(null)
  const sortDropdownRef = useRef<HTMLDivElement>(null)

  // Example articles data
  const articles = useMemo(() => [
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
    },
    {
      id: "000002", 
      title_english: "Analysis of the Policy Gradient Theorem",
      title_spanish: "Análisis del Teorema del Gradiente de la Política",
      description_english: "Analysis of the policy gradient theorem and its application in Reinforcement Learning",
      description_spanish: "Análisis del teorema del gradiente de la política y su aplicación en Reinforcement Learning",
      date: "2025-02-23",
      tags: ["Reinforcement Learning"],
      author: "Leonardo Pérez",
      article_english: "/articles/000002/article.en.md",
      article_spanish: "/articles/000002/article.es.md"
    },
    {
      id: "000003",
      title_english: "Explaining Proximal Policy Optimization",
      title_spanish: "Explicando Proximal Policy Optimization",
      description_english: "Explaining and analyzing the Proximal Policy Optimization algorithm and its implementation in PyTorch",
      description_spanish: "Explicación y análisis del algoritmo Proximal Policy Optimization y su implementación en PyTorch",
      date: "2025-03-20",
      tags: ["Reinforcement Learning"],
      author: "Leonardo Pérez",
      article_english: "/articles/000003/article.en.md",
      article_spanish: "/articles/000003/article.es.md"
    },
    {
      id: "000004",
      title_english: "Designing AI Agent Patterns",
      title_spanish: "Diseño de patrones de agentes de IA",
      description_english: "Explaining and analyzing the AI agent design patterns and their implementation in LangGraph",
      description_spanish: "Explicación y análisis de los patrones de diseño de agentes de IA y su implementación en LangGraph",
      date: "2025-03-21",
      tags: ["LangGraph","Agents"],
      author: "Raúl Quispe",
      article_english: "/articles/000004/article.en.md",
      article_spanish: "/articles/000004/article.es.md"
    }
  ], [])

  const tags = ["All", "Agents", "LLM", "Langraph", "Reinforcement Learning"]

  // Filtrar y ordenar artículos
  const filteredAndSortedArticles = useMemo(() => {
    return articles
      .filter(article => {
        const title = language === 'en' ? article.title_english : article.title_spanish
        const description = language === 'en' ? article.description_english : article.description_spanish
        const searchLower = searchQuery.toLowerCase()
        
        // Filtrar por búsqueda
        const matchesSearch = title.toLowerCase().includes(searchLower) || 
                            description.toLowerCase().includes(searchLower)
        
        // Filtrar por tag
        const matchesTag = selectedTag === 'all' || 
                         article.tags.map(t => t.toLowerCase()).includes(selectedTag)
        
        return matchesSearch && matchesTag
      })
      .sort((a, b) => {
        // Ordenar por fecha
        if (sortOrder === 'newest') {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        } else {
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        }
      })
  }, [articles, searchQuery, selectedTag, sortOrder, language])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target as Node)) {
        setIsTagDropdownOpen(false)
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

        {/* Tag Dropdown */}
        <div className="custom-dropdown" ref={tagDropdownRef}>
          <div 
            className="dropdown-header"
            onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
          >
            <span>
              {selectedTag === 'all' 
                ? (language === 'en' ? 'All Tags' : 'Todas las Etiquetas') 
                : selectedTag}
            </span>
            <span className={`dropdown-arrow ${isTagDropdownOpen ? 'open' : ''}`}>▼</span>
          </div>
          {isTagDropdownOpen && (
            <div className="dropdown-content">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className={`dropdown-item ${selectedTag === tag.toLowerCase() ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedTag(tag.toLowerCase())
                    setIsTagDropdownOpen(false)
                  }}
                >
                  {tag === 'All' ? (language === 'en' ? 'All Tags' : 'Todas las Etiquetas') : tag}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="custom-dropdown" ref={sortDropdownRef}>
          <div 
            className="dropdown-header"
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
          >
            <span>
              {sortOrder === 'newest' 
                ? (language === 'en' ? 'Newest First' : 'Más Recientes')
                : (language === 'en' ? 'Oldest First' : 'Más Antiguos')}
            </span>
            <span className={`dropdown-arrow ${isSortDropdownOpen ? 'open' : ''}`}>▼</span>
          </div>
          {isSortDropdownOpen && (
            <div className="dropdown-content">
              <div
                className={`dropdown-item ${sortOrder === 'newest' ? 'selected' : ''}`}
                onClick={() => {
                  setSortOrder('newest')
                  setIsSortDropdownOpen(false)
                }}
              >
                {language === 'en' ? 'Newest First' : 'Más Recientes'}
              </div>
              <div
                className={`dropdown-item ${sortOrder === 'oldest' ? 'selected' : ''}`}
                onClick={() => {
                  setSortOrder('oldest')
                  setIsSortDropdownOpen(false)
                }}
              >
                {language === 'en' ? 'Oldest First' : 'Más Antiguos'}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="articles-grid">
        {filteredAndSortedArticles.length > 0 ? (
          filteredAndSortedArticles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={language === 'en' ? article.title_english : article.title_spanish}
              description={language === 'en' ? article.description_english : article.description_spanish}
              date={article.date}
              tags={article.tags}
              author={article.author}
            />
          ))
        ) : (
          <div className="no-results">
            {language === 'en' 
              ? 'No articles found matching your criteria.'
              : 'No se encontraron artículos que coincidan con tu búsqueda.'}
          </div>
        )}
      </div>
    </div>
  )
}

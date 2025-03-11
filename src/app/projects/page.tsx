'use client'
import { useState } from 'react'
import ProjectCard from './components/ProjectCard'
import { useLanguage } from '../context/LanguageContext'
import './style.css'

export default function Research() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const projects = [
    {
      title: "MIND",
      date: "January 19, 2025",
      description: language === 'en' 
        ? "Explaining Large Language Models (LLM) from scratch. Everything you need to know about them and how to build one"
        : "Explicando los Large Language Models (LLM) desde cero. Todo lo que necesitas saber sobre estos y cómo construir uno"
    },
    {
      title: "SO-ARM100",
      date: "January 19, 2025",
      description: language === 'en'
        ? "Training SO-ARM100 robotic arms with neural networks. Detailed documentation on how you can do it with various techniques"
        : "Entrenando los brazos robóticos de SO-ARM100 con redes neuronales. La documentación detallada de cómo puedes hacerlo y con diversas técnicas"
    }
  ];

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="research-container">
      <div className="research-header">
        <h1 className="research-title">
          {language === 'en' ? 'PROJECTS' : 'PROYECTOS'}
        </h1>
        <div className="search-container">
          <input 
            type="text" 
            placeholder={language === 'en' ? "Search projects..." : "Buscar proyectos..."}
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="research-content">
        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              date={project.date}
              description={project.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

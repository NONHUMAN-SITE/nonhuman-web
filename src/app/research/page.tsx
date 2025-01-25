'use client'
import MainLayout from '../main-layout'
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
      imageUrl: "/projects/mind.png",
      description: language === 'en' 
        ? "Explaining Large Language Models (LLM) from scratch. Everything you need to know about them and how to build one"
        : "Explicando los Large Language Models (LLM) desde cero. Todo lo que necesitas saber sobre estos y cómo construir uno"
    },
    {
      title: "S0-ARM100",
      date: "January 19, 2025",
      imageUrl: "/projects/so-arm100.png",
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
    <MainLayout>
      <div className="research-container">
        <div className="research-header">
          <h1 className="research-title lora-main">
            {language === 'en' ? 'Research' : 'Investigación'}
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
        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              date={project.date}
              imageUrl={project.imageUrl}
              description={project.description}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

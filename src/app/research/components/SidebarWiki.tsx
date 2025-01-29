'use client'
import { useEffect, useState, useCallback } from 'react';
import '../styles/sidebar-wiki.css';

interface HeadingItem {
  text: string;
  level: number;
  id: string;
}

interface SidebarWikiProps {
  content: string;
  slugify: (str: string) => string;
}

export default function SidebarWiki({ content, slugify }: SidebarWikiProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [headings, setHeadings] = useState<HeadingItem[]>([]);

  const extractHeadings = useCallback((markdown: string): HeadingItem[] => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const headings: HeadingItem[] = [];
    
    let match: RegExpExecArray | null;
    while ((match = headingRegex.exec(markdown)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = slugify(text);
      
      headings.push({ text, level, id });
    }
    
    return headings;
  }, [slugify]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      requestAnimationFrame(() => {
        const headerOffset = 120;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        
        window.scrollTo({
          top: elementPosition - headerOffset,
          behavior: 'smooth'
        });
        
        setTimeout(() => {
          const finalPosition = element.getBoundingClientRect().top + window.scrollY;
          if (Math.abs(finalPosition - elementPosition) > 10) {
            window.scrollTo({
              top: finalPosition - headerOffset,
              behavior: 'smooth'
            });
          }
          setActiveId(id);
        }, 100);
      });
    }
  };

  // Actualizar headings cuando cambia el contenido
  useEffect(() => {
    setHeadings(extractHeadings(content));
  }, [content, extractHeadings]);

  // Actualizar el observer para mejor precisión
  useEffect(() => {
    if (!headings.length) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      // Encontrar la entrada más cercana al viewport
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        const mostVisible = visibleEntries.reduce((prev, current) => {
          return (prev.intersectionRatio > current.intersectionRatio) ? prev : current;
        });
        setActiveId(mostVisible.target.id);
      }
    };

    const observerOptions: IntersectionObserverInit = {
      rootMargin: '-100px 0px -80% 0px',
      threshold: [0, 0.1, 0.5, 1]
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Aumentar el delay para asegurar que todo está renderizado
    const timer = setTimeout(() => {
      const headingElements = document.querySelectorAll('[data-heading]');
      headingElements.forEach(element => observer.observe(element));
    }, 200);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [headings]);

  // Actualizar activeId basado en scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element) {
          const { top } = element.getBoundingClientRect();
          if (top <= 150) {
            setActiveId(heading.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  return (
    <aside className="sidebar-wiki">
      <nav>
        <h3 className="text-xl font-bold mb-4">Contenido</h3>
        <ul>
          {headings.map((heading, index) => (
            <li 
              key={index}
              className={`toc-item toc-h${heading.level} ${
                activeId === heading.id ? 'active' : ''
              }`}
              onClick={() => scrollToHeading(heading.id)}
            >
              {heading.text}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

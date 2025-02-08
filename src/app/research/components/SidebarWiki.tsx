'use client'
import { useEffect, useState, useCallback, useRef } from 'react';
import '../styles/sidebar-wiki.css';
import { useLanguage } from '@/app/context/LanguageContext';

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
  const { language } = useLanguage();
  const [activeId, setActiveId] = useState<string>('');
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);

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

  // Función para sincronizar el scroll del sidebar
  const syncSidebarScroll = useCallback((activeId: string) => {
    if (sidebarRef.current) {
      const activeElement = sidebarRef.current.querySelector(`.toc-item.active`);
      if (activeElement) {
        const sidebarTop = sidebarRef.current.offsetTop;
        const activeElementTop = activeElement.getBoundingClientRect().top;
        const sidebarHeight = sidebarRef.current.clientHeight;
        const activeElementHeight = (activeElement as HTMLElement).offsetHeight;

        // Calcular la posición ideal para centrar el elemento activo
        const scrollTarget = 
          activeElementTop + 
          sidebarRef.current.scrollTop - 
          sidebarTop - 
          (sidebarHeight / 2) + 
          (activeElementHeight / 2);

        sidebarRef.current.scrollTo({
          top: scrollTarget,
          behavior: 'smooth'
        });
      }
    }
  }, []);

  // Actualizar el observer para mejor precisión
  useEffect(() => {
    if (!headings.length) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        const mostVisible = visibleEntries.reduce((prev, current) =>
          prev.intersectionRatio > current.intersectionRatio ? prev : current
        );
        const newActiveId = mostVisible.target.id;
        setActiveId(newActiveId);
      }
    };

    const observerOptions: IntersectionObserverInit = {
      rootMargin: '-100px 0px -80% 0px',
      threshold: [0, 0.1, 0.5, 1]
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const timer = setTimeout(() => {
      const headingElements = document.querySelectorAll('[data-heading]');
      headingElements.forEach(element => observer.observe(element));
    }, 200);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [headings.length]);

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
    <aside className="sidebar-wiki" ref={sidebarRef}>
      <nav>
        <h3 className="text-xl font-bold mb-4">
          {language === 'es' ? 'Contenido' : 'Content'}
        </h3>
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

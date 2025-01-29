'use client'
import { useEffect, useState, useCallback } from 'react';

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
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveId(id);
    }
  };

  // Actualizar headings cuando cambia el contenido
  useEffect(() => {
    setHeadings(extractHeadings(content));
  }, [content, extractHeadings]);

  // Observar las secciones visibles
  useEffect(() => {
    if (!headings.length) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observerOptions: IntersectionObserverInit = {
      rootMargin: '-20% 0px -80% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Pequeño delay para asegurar que los elementos están renderizados
    const timer = setTimeout(() => {
      headings.forEach(heading => {
        const element = document.getElementById(heading.id);
        if (element) observer.observe(element);
      });
    }, 100);

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

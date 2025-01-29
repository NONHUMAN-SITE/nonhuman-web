'use client'
import { useEffect, useState } from 'react';

interface HeadingItem {
  text: string;
  level: number;
  id: string;
}

interface SidebarWikiProps {
  content: string;
}

export default function SidebarWiki({ content }: SidebarWikiProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [headings, setHeadings] = useState<HeadingItem[]>([]);

  const extractHeadings = (markdown: string): HeadingItem[] => {
    const headingRegex = /^#{1,3}\s+(.+)$/gm;
    const headings: HeadingItem[] = [];
    
    let match: RegExpExecArray | null;
    while ((match = headingRegex.exec(markdown)) !== null) {
      const level = match[0].split(' ')[0].length;
      const text = match[1].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      
      headings.push({ text, level, id });
    }
    
    return headings;
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      setTimeout(() => {
        window.scrollBy(0, -120);
      }, 100);
      
      setActiveId(id);
    }
  };

  useEffect(() => {
    const extractedHeadings = extractHeadings(content);
    setHeadings(extractedHeadings);
  }, [content]);

  return (
    <div className="sidebar-wiki">
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
    </div>
  );
}

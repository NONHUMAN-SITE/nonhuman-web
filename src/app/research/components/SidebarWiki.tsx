'use client'

interface HeadingItem {
  text: string;
  level: number;
  id: string;
}

interface SidebarWikiProps {
  content: string;
}

export default function SidebarWiki({ content }: SidebarWikiProps) {
  const extractHeadings = (markdown: string): HeadingItem[] => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const headings: HeadingItem[] = [];
    
    let match;
    while ((match = headingRegex.exec(markdown)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      // Generar un ID único basado en el texto del encabezado
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
      element.scrollIntoView({ behavior: 'smooth' });
      // Añadir un pequeño offset para no ocultar el encabezado detrás del navbar
      window.scrollBy(0, -80);
    }
  };

  const headings = extractHeadings(content);

  return (
    <div className="sidebar-wiki">
      <nav>
        <h3 className="text-xl font-bold mb-4">Contenido</h3>
        <ul>
          {headings.map((heading, index) => (
            <li 
              key={index}
              className={`toc-item toc-h${heading.level}`}
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

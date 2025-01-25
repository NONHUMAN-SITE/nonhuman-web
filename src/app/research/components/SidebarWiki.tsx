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
    const headingRegex = /^(#{1,2})\s+(.+)$/gm;
    const headings: HeadingItem[] = [];
    
    let match;
    while ((match = headingRegex.exec(markdown)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-');
      
      headings.push({ text, level, id });
    }
    
    return headings;
  };

  const headings = extractHeadings(content);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sidebar-wiki">
      <nav className="sticky top-24">
        <h3 className="text-xl font-bold mb-4">Table of Contents</h3>
        <ul className="space-y-2">
          {headings.map((heading, index) => (
            <li 
              key={index}
              className={`cursor-pointer hover:text-accent-color transition-colors
                ${heading.level === 1 ? 'ml-0' : 'ml-4'}`}
              style={{ 
                fontSize: heading.level === 1 ? '1rem' : '0.9rem',
                opacity: heading.level === 1 ? 1 : 0.8
              }}
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

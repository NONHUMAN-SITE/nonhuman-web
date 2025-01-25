'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-3xl font-bold my-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-bold my-3">{children}</h2>,
          p: ({ children }) => <p className="my-2">{children}</p>,
          code: ({ children }) => <code className="bg-gray-800 rounded px-2 py-1">{children}</code>,
          pre: ({ children }) => <pre className="bg-gray-800 rounded p-4 my-4 overflow-x-auto">{children}</pre>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

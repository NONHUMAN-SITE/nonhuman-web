'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypePrism from 'rehype-prism-plus'
import 'katex/dist/katex.min.css'
import 'prismjs/themes/prism-tomorrow.css'
import '../styles/markdown-content.css'
import { DetailedHTMLProps, HTMLAttributes } from 'react'

interface MarkdownRendererProps {
  content: string;
  options?: {
    slugify?: (str: string) => string;
  };
}

type CodeProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function MarkdownRenderer({ content, options }: MarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          [rehypeSlug, { slugify: options?.slugify }],
          rehypeKatex,
          rehypePrism
        ]}
        components={{
          h1: ({ children }) => <h1 className="text-4xl font-bold my-6">{children}</h1>,
          h2: ({ children }) => <h2 className="text-3xl font-bold my-5">{children}</h2>,
          h3: ({ children }) => <h3 className="text-2xl font-bold my-4">{children}</h3>,
          h4: ({ children }) => <h4 className="text-xl font-bold my-3">{children}</h4>,
          h5: ({ children }) => <h5 className="text-lg font-bold my-2">{children}</h5>,
          h6: ({ children }) => <h6 className="text-base font-bold my-2">{children}</h6>,
          p: ({ children, node }) => {
            const hasImage = node?.children?.some((child: any) => 
              child.type === 'element' && child.tagName === 'img'
            );
            
            if (hasImage) {
              return <>{children}</>;
            }
            
            return <p className="my-4 text-base leading-relaxed">{children}</p>;
          },
          img: ({ src, alt }) => {
            const sizeMatch = alt?.match(/(.*)\|(\d+)x(\d+)/);
            const dimensions = sizeMatch 
              ? { width: sizeMatch[2], height: sizeMatch[3], alt: sizeMatch[1] }
              : { width: '600', height: '400', alt: alt };

            return (
              <figure className="my-4">
                <img 
                  src={src} 
                  alt={dimensions.alt} 
                  className="mx-auto rounded-lg shadow-lg"
                  loading="lazy"
                  width={dimensions.width}
                  height={dimensions.height}
                  style={{ 
                    maxWidth: `${dimensions.width}px`,
                    height: 'auto'
                  }}
                />
                {dimensions.alt && <figcaption className="text-sm text-gray-600 mt-2 text-center">{dimensions.alt}</figcaption>}
              </figure>
            )
          },
          code: ({ inline, className, children, ...props }: CodeProps) => {
            const match = /language-(\w+)/.exec(className || '')
            return !inline ? (
              <pre className="relative">
                <code
                  {...props}
                  className={`block overflow-x-auto p-4 rounded-lg bg-gray-800 ${className || ''}`}
                >
                  {children}
                </code>
              </pre>
            ) : (
              <code {...props} className="bg-gray-800 text-gray-200 rounded px-2 py-1">
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

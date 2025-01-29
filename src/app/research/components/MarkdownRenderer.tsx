'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypePrism from 'rehype-prism-plus'
import { MdContentCopy } from "react-icons/md";
import 'katex/dist/katex.min.css'
import 'prismjs/themes/prism-tomorrow.css'
import '../styles/markdown-content.css'
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react'
import React from 'react'
import { Components } from 'react-markdown'

interface MarkdownRendererProps {
  content: string;
  options?: {
    slugify?: (str: string) => string;
  };
}

type CodeProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
}

// Actualizado el tipo PreProps para usar Components
type PreProps = Components['pre'] & {
  children?: ReactNode;
  className?: string;
}

interface CodeElement extends React.ReactElement {
  props: {
    children?: string | ReactNode[];
  };
}

interface ChildProps {
  type?: string;
  props?: {
    children?: string | ChildProps[] | ReactNode;
  };
  children?: string | ChildProps[] | ReactNode;
}

export default function MarkdownRenderer({ content, options }: MarkdownRendererProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Código copiado al portapapeles');
      })
      .catch(err => {
        console.error('Error al copiar:', err);
      });
  };

  return (
    <div className="markdown-content">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          [rehypeSlug, { 
            slugify: (text: string) => {
              const id = options?.slugify?.(text) || text
                .toLowerCase()
                .replace(/[áàäâã]/g, 'a')
                .replace(/[éèëê]/g, 'e')
                .replace(/[íìïî]/g, 'i')
                .replace(/[óòöôõ]/g, 'o')
                .replace(/[úùüû]/g, 'u')
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
              return id;
            }
          }],
          rehypeKatex,
          rehypePrism
        ]}
        components={{
          h1: ({ children, id }) => (
            <h1 
              id={id} 
              className="text-4xl font-bold mt-8 mb-4"
              data-heading="1"
            >
              {children}
            </h1>
          ),
          h2: ({ children, id }) => (
            <h2 
              id={id} 
              className="text-3xl font-bold mt-6 mb-3"
              data-heading="2"
            >
              {children}
            </h2>
          ),
          h3: ({ children, id }) => (
            <h3 
              id={id} 
              className="text-2xl font-bold mt-5 mb-2"
              data-heading="3"
            >
              {children}
            </h3>
          ),
          h4: ({ children }) => <h4 className="text-xl font-bold my-3">{children}</h4>,
          h5: ({ children }) => <h5 className="text-lg font-bold my-2">{children}</h5>,
          h6: ({ children }) => <h6 className="text-base font-bold my-2">{children}</h6>,
          p: ({ children, node }) => {
            const hasOnlyPreChild = node?.children?.length === 1 && 
              node?.children[0]?.type === 'element' && 
              node?.children[0]?.tagName === 'pre';

            if (hasOnlyPreChild) {
              return <>{children}</>;
            }

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
          pre: ({ node, ...props }) => {
            const children = props.children as ReactNode;
            const code = React.Children.toArray(children)[0] as CodeElement;
            let codeText = '';
            
            if (code?.props?.children) {
              if (typeof code.props.children === 'string') {
                codeText = code.props.children;
              } else if (Array.isArray(code.props.children)) {
                codeText = code.props.children
                  .map((child: ReactNode) => {
                    if (typeof child === 'string') return child;
                    if (React.isValidElement<{ children?: string }>(child) && typeof child.props?.children === 'string') {
                      return child.props.children;
                    }
                    return '';
                  })
                  .join('');
              }
            }
            
            return (
              <pre {...props} className={`relative ${props.className || ''}`}>
                <button 
                  className="copy-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(codeText);
                  }}
                >
                  <MdContentCopy size={20} />
                </button>
                {children}
              </pre>
            );
          },
          code: ({ inline, className, children, ...props }: CodeProps) => {
            const match = /language-(\w+)/.exec(className || '')
            return !inline ? (
              <code
                {...props}
                className={`block overflow-x-auto p-4 bg-gray-800 ${className || ''}`}
              >
                {children}
              </code>
            ) : (
              <code {...props} className="bg-gray-800 text-gray-200 rounded-md px-2 py-1">
                {children}
              </code>
            )
          },
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="min-w-full">{children}</table>
            </div>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-green-500 pl-4 italic">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a href={href} className="text-green-600 hover:text-green-800 hover:underline">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

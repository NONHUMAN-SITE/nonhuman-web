'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypePrism from 'rehype-prism-plus'
import rehypeRaw from 'rehype-raw'
import { MdContentCopy } from "react-icons/md";
import 'katex/dist/katex.min.css'
import 'prismjs/themes/prism-tomorrow.css'
import '../styles/markdown-content.css'
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface MarkdownRendererProps {
  content: string;
  theme?: 'light' | 'dark';
  options?: {
    slugify?: (str: string) => string;
  };
}

type CodeProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
}

interface CodeElement extends React.ReactElement {
  props: {
    children?: string | ReactNode[];
  };
}

// Nuevo componente para renderizar tarjetas de enlace especiales
function SpecialLinkCard({ href }: { href: string }) {
  const [ogImage, setOgImage] = useState<string | null>(null);
  const source = href.includes('github.com') ? 'github.com' : 'huggingface.co';

  useEffect(() => {
    async function fetchOGImage() {
      try {
        if (href.includes('github.com')) {
          const regex = /github\.com\/([^\/]+)\/([^\/\?#]+)/;
          const match = href.match(regex);
          if (match) {
            const [, owner, repo] = match;
            setOgImage(`https://opengraph.githubassets.com/1/${owner}/${repo}`);
          }
        } else if (href.includes('huggingface.co')) {
          const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(href)}`);
          const data = await response.json();
          const html = data.contents;
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const ogImageMeta = doc.querySelector('meta[property="og:image"]');
          const ogImageUrl = ogImageMeta?.getAttribute('content');
          if (ogImageUrl) {
            setOgImage(ogImageUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching OG image:', error);
      }
    }

    fetchOGImage();
  }, [href]);

  return (
    <span className="markdown-card-wrapper">
      <a href={href} target="_blank" rel="noopener noreferrer" className="markdown-card">
        {ogImage && (
          <>
            <img 
              src={ogImage} 
              alt=""
              className="markdown-card-image"
              loading="lazy"
            />
            <span className="markdown-card-source">From {source}</span>
          </>
        )}
      </a>
    </span>
  );
}

export default function MarkdownRenderer({ content, options, theme = 'dark' }: MarkdownRendererProps) {
  const [mermaidInitialized, setMermaidInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('mermaid').then((mermaidModule) => {
        const mermaid = mermaidModule.default;
        mermaid.initialize({
          startOnLoad: true,
          theme: theme === 'dark' ? 'dark' : 'default',
          securityLevel: 'loose'
        });
        setMermaidInitialized(true);
      });
    }
  }, [theme]);

  useEffect(() => {
    if (mermaidInitialized) {
      import('mermaid').then((mermaidModule) => {
        const mermaid = mermaidModule.default;
        document.querySelectorAll('.mermaid').forEach(element => {
          element.innerHTML = element.getAttribute('data-original-content') || element.innerHTML;
        });
        mermaid.init(undefined, '.mermaid');
      });
    }
  }, [content, mermaidInitialized, theme]);

  return (
    <div className="markdown-content" data-theme={theme}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSlug, { 
            slugify: (text: string) => {
              const id = options?.slugify?.(text) || text
                .toLowerCase();
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
            type MarkdownNode = {
              children?: Array<{
                type: string;
                tagName?: string;
              }>;
            };

            const typedNode = node as MarkdownNode;
            
            // Si el párrafo contiene solo un enlace especial, no lo envolvemos en <p>
            const hasOnlySpecialLink = typedNode?.children?.length === 1 && 
              typedNode?.children[0]?.type === 'element' && 
              typedNode?.children[0]?.tagName === 'a';

            if (hasOnlySpecialLink) {
              return <>{children}</>;
            }

            const hasOnlyPreChild = typedNode?.children?.length === 1 && 
              typedNode?.children[0]?.type === 'element' && 
              typedNode?.children[0]?.tagName === 'pre';

            if (hasOnlyPreChild) {
              return <>{children}</>;
            }

            const hasImage = typedNode?.children?.some(child => 
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
              ? { width: parseInt(sizeMatch[2]), height: parseInt(sizeMatch[3]), alt: sizeMatch[1] }
              : { width: 1000, height: 600, alt: alt };

            const isGithubRaw = src?.includes('raw.githubusercontent.com');
            const isVideo = src?.match(/\.(webm|mp4|mov|ogg)$/i);
            const isGif = src?.match(/\.gif$/i);

            // Si es un GIF o viene de GitHub raw, usar img en lugar de Image
            if (isGif || isGithubRaw) {
              return (
                <figure className="my-4">
                  <img
                    src={src || ''}
                    alt={dimensions.alt || ''}
                    className="mx-auto rounded-lg shadow-lg"
                    style={{ 
                      maxWidth: '100%',
                      height: 'auto'
                    }}
                  />
                  {dimensions.alt && <figcaption className="text-sm text-gray-600 mt-2 text-center">{dimensions.alt}</figcaption>}
                </figure>
              );
            }

            return (
              <figure className="my-4">
                {isVideo ? (
                  <video
                    src={src}
                    className="mx-auto rounded-lg shadow-lg"
                    controls
                    muted
                    loop
                    width={dimensions.width}
                    height={dimensions.height}
                    style={{ 
                      maxWidth: '100%',
                      height: 'auto'
                    }}
                  />
                ) : (
                  <Image 
                    src={src || ''} 
                    alt={dimensions.alt || ''} 
                    className="mx-auto rounded-lg shadow-lg"
                    width={dimensions.width}
                    height={dimensions.height}
                    style={{ 
                      maxWidth: '100%',
                      height: 'auto'
                    }}
                  />
                )}
                {dimensions.alt && <figcaption className="text-sm text-gray-600 mt-2 text-center">{dimensions.alt}</figcaption>}
              </figure>
            )
          },
          pre: ({ ...props }) => {
            const children = props.children as ReactNode;
            const code = React.Children.toArray(children)[0] as CodeElement;
            let codeText = '';
            
            const extractCodeText = (node: ReactNode): string => {
              if (typeof node === 'string') return node;
              if (Array.isArray(node)) return node.map(extractCodeText).join('');
              if (React.isValidElement(node)) {
                const element = node as React.ReactElement<{ children?: ReactNode }>;
                if (element.props.children) {
                  return extractCodeText(element.props.children);
                }
                return '';
              }
              return '';
            };

            if (code?.props?.children) {
              codeText = extractCodeText(code.props.children);
            }
            
            return (
              <CodeBlock {...props} codeText={codeText}>
                {children}
              </CodeBlock>
            );
          },
          code: ({ inline, className, children, ...props }: CodeProps) => {
            const match = /language-(\w+)/.exec(className || '');
            
            if (match?.[1] === 'mermaid') {
              return (
                <div 
                  className="mermaid" 
                  data-original-content={String(children).replace(/\n$/, '')}
                  style={{
                    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    margin: '1.5rem 0',
                    textAlign: 'center'
                  }}
                >
                  {String(children).replace(/\n$/, '')}
                </div>
              );
            }

            return !inline ? (
              <code
                {...props}
                className={`block overflow-x-auto p-4 bg-gray-800 ${className || ''}`}
              >
                {children}
              </code>
            ) : (
              <code {...props} className="inline-code">
                {children}
              </code>
            )
          },
          // Componente personalizado para enlaces
          a: ({ children, href }) => {
            // Verificamos si es un enlace de GitHub o Hugging Face
            if (
              href &&
              (href.includes('github.com') || href.includes('huggingface.co')) &&
              // Verificamos que children sea un string y coincida con el href
              (
                (typeof children === 'string' && children === href) ||
                (Array.isArray(children) && 
                 children.length === 1 && 
                 typeof children[0] === 'string' && 
                 children[0] === href)
              )
            ) {
              return <SpecialLinkCard href={href} />;
            }

            // Caso por defecto: renderizamos el enlace normal
            return (
              <a 
                href={href} 
                className="link-style"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  position: 'relative',
                  padding: '0 2px'
                }}
              >
                {children}
              </a>
            );
          },
          details: ({ children }) => (
            <details className="html-details">
              {children}
            </details>
          ),
          summary: ({ children }) => (
            <summary className="html-summary">
              {children}
            </summary>
          ),
          div: ({ children, className }) => (
            <div className={className}>
              {children}
            </div>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-6 my-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-6 my-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="my-2">
              {children}
            </li>
          ),
          em: ({ children }) => (
            <em className="italic font-medium">
              {children}
            </em>
          ),
          strong: ({ children }) => (
            <strong className="font-bold" style={{ color: "var(--accent-color)" }}>
              {children}
            </strong>
          ),
        }}
        allowedElements={[
          'details', 'summary', 'div', 'span',
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', 'img', 'pre', 'code', 'table', 'blockquote', 'a',
          'ul', 'ol', 'li', 'em', 'strong',
          'thead', 'tbody', 'tr', 'th', 'td'
        ]}
        unwrapDisallowed={true}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

const CodeBlock = ({ children, className, codeText, ...props }: { children: ReactNode; className?: string; codeText: string }) => {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText)
      .then(() => {
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      })
      .catch(err => console.error('Error copying:', err));
  };

  return (
    <pre {...props} className={`relative ${className || ''}`}>
      <button 
        className="copy-button"
        onClick={(e) => {
          e.stopPropagation();
          handleCopy();
        }}
      >
        <MdContentCopy size={20} />
      </button>
      {showCopied && (
        <div className="copied-notification">
          ✓ Copied!
        </div>
      )}
      {children}
    </pre>
  );
};

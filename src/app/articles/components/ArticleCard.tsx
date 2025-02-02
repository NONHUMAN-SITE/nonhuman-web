interface ArticleCardProps {
  title: string;
  description: string;
  date: string;
  tags: string[];
  author: string;
}

export default function ArticleCard({ title, description, date, tags, author }: ArticleCardProps) {
  return (
    <div className="article-card">
      <div className="article-header">
        <h2 className="article-title space-mono-bold">{title}</h2>
        <div className="article-metadata">
          <span className="article-date">{date}</span>
          <span className="article-author">{author}</span>
        </div>
      </div>
      <p className="article-description">{description}</p>
      <div className="article-tags">
        {tags.map((tag) => (
          <span key={tag} className="tag-badge">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

interface ProjectCardProps {
  title: string;
  date: string;
  imageUrl: string;
  description: string;
}

export default function ProjectCard({ 
  title, 
  date, 
  imageUrl, 
  description 
}: ProjectCardProps) {
  return (
    <div className="project-card">
      <img src={imageUrl} alt={title} className="project-image" />
      <div className="project-info">
        <h3 className="project-title">{title}</h3>
        <p className="project-date">{date}</p>
        <p className="project-description">{description}</p>
      </div>
    </div>
  );
}

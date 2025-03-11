import { useRouter } from 'next/navigation';

interface ProjectCardProps {
  title: string;
  date: string;
  description: string;
}

export default function ProjectCard({ 
  title, 
  date, 
  description 
}: ProjectCardProps) {
  const router = useRouter();

  const handleClick = () => {
    const path = `/projects/wiki/${title.replace(/\s+/g, '')}`;
    router.push(path);
  };

  return (
    <div className="project-card" onClick={handleClick}>
      <div className="card-text">
        <h3 className="project-title">{title}</h3>
        <p className="project-date">{date}</p>
        <p className="project-description">{description}</p>
      </div>
    </div>
  );
}

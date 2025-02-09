import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
  const router = useRouter();

  const handleClick = () => {
    const path = `/research/wiki/${title.replace(/\s+/g, '')}`;
    router.push(path);
  };

  return (
    <div className="project-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <Image 
        src={imageUrl} 
        alt={title} 
        className="project-image"
        width={400}
        height={300}
      />
      <div className="project-info">
        <h3 className="project-title">{title}</h3>
        <p className="project-date">{date}</p>
        <p className="project-description">{description}</p>
      </div>
    </div>
  );
}

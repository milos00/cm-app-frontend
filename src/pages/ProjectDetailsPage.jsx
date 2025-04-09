import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectTabs from '../components/project/ProjectTabs';

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/projects`);
        const data = await response.json();
        const selected = data.find((p) => String(p.id) === String(projectId));
        setProject(selected);
      } catch (error) {
        console.error('Greška pri dohvatanju projekta:', error);
      }
    };

    fetchProject();
  }, [projectId]);

  if (!project) {
    return <div className="p-6">Učitavanje projekta...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">{project.name}</h2>
      <ProjectTabs projectId={projectId} />
    </div>
  );
};

export default ProjectDetailsPage;

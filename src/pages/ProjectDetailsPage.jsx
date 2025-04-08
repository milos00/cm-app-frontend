import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectTabs from '../components/project/ProjectTabs';

const ProjectDetailsPage = () => {
  const { projectId } = useParams();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Projekat #{projectId}</h2>
      <ProjectTabs projectId={projectId} />
    </div>
  );
};

export default ProjectDetailsPage;
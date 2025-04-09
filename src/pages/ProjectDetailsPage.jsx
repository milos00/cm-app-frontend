import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectTabs from '../components/project/ProjectTabs';

const ProjectDetailsPage = () => {
  const navigate = useNavigate();
  const projectId = parseInt(useParams().projectId, 10);
  const [project, setProject] = useState({ name: '' });

  useEffect(() => {
    if (!projectId || isNaN(projectId)) return;

    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/projects/${projectId}`);
        if (!res.ok) throw new Error('Neuspešno dobijanje projekta');
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error('Greška:', err);
      }
    };

    fetchProject();
  }, [projectId]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Nazad na projekte
      </button>

      <h2 className="text-xl font-bold mb-4">{project.name}</h2>

      <ProjectTabs projectId={projectId} />
    </div>
  );
};

export default ProjectDetailsPage;
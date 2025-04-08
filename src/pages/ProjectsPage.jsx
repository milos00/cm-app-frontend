import React, { useEffect, useState } from 'react';
import { getProjects } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Greška pri dohvatanju projekata:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleClick = (id) => {
    navigate(`/projects/${id}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Svi Projekti</h1>
      <ul className="space-y-3">
        {projects.map((project) => (
          <li
            key={project.id}
            className="p-4 border rounded cursor-pointer hover:bg-gray-100"
            onClick={() => handleClick(project.id)}
          >
            <div className="font-semibold">{project.name}</div>
            <div className="text-sm text-gray-600">{project.location}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsPage;
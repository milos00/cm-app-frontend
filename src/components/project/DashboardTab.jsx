import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardTab = ({ projectId }) => {
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/projects`);
        const found = response.data.find((p) => p.id === parseInt(projectId));
        setProject(found);
      } catch (error) {
        console.error('Greška pri učitavanju projekta:', error);
      }
    };

    fetchProject();
  }, [projectId]);

  if (!project) return <div className="p-4">Učitavanje...</div>;

  return (
    <div className="p-4">
      <p className="text-sm text-gray-600 mb-2">{project.location}</p>
      <p className="mb-2">{project.description}</p>
      <div className="text-sm text-gray-500">
        <strong>Početak:</strong> {project.start_date?.slice(0, 10)}<br />
        <strong>Kraj:</strong> {project.end_date?.slice(0, 10)}
      </div>
    </div>
  );
};

export default DashboardTab;
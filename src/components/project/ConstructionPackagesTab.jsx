import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ConstructionPackagesTab = ({ projectId }) => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/projects/${projectId}/packages`);
        setPackages(response.data);
      } catch (error) {
        console.error('Greška pri dohvatanju paketa:', error);
      }
    };

    fetchPackages();
  }, [projectId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Construction Packages</h2>
      {packages.length === 0 ? (
        <p>Nema definisanih paketa za ovaj projekat.</p>
      ) : (
        <ul className="space-y-2">
          {packages.map((pkg) => (
            <li key={pkg.id} className="border p-3 rounded">
              <div className="font-semibold">{pkg.name}</div>
              <div className="text-sm text-gray-600">{pkg.scope}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConstructionPackagesTab;

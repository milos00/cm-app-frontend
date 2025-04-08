import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ConstructionPackagesTab = ({ projectId }) => {
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({ name: '', scope: '' });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/projects/${projectId}/packages`
        );
        setPackages(response.data);
      } catch (error) {
        console.error('Greška pri dohvatanju paketa:', error);
      }
    };

    fetchPackages();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:4000/api/projects/${projectId}/packages`,
        newPackage
      );
      setPackages([...packages, response.data]);
      setNewPackage({ name: '', scope: '' });
    } catch (error) {
      console.error('Greška pri dodavanju paketa:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Construction Packages</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <h3 className="text-lg font-semibold">Dodaj novi paket</h3>
        <input
          type="text"
          placeholder="Naziv paketa"
          value={newPackage.name}
          onChange={(e) =>
            setNewPackage({ ...newPackage, name: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          placeholder="Opis (scope)"
          value={newPackage.scope}
          onChange={(e) =>
            setNewPackage({ ...newPackage, scope: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Dodaj paket
        </button>
      </form>

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
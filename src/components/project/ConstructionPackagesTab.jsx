import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ConstructionPackagesTab = ({ projectId }) => {
  const [packages, setPackages] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [newPackage, setNewPackage] = useState({ name: '', scope: '' });
  const [selectedContractors, setSelectedContractors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packagesRes, contractorsRes] = await Promise.all([
          axios.get(`http://localhost:4000/api/projects/${projectId}/packages`),
          axios.get(`http://localhost:4000/api/projects/${projectId}/contractors`)
        ]);

        setPackages(packagesRes.data);
        setContractors(contractorsRes.data);
      } catch (error) {
        console.error('Greška pri dohvatanju podataka:', error);
      }
    };

    fetchData();
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

  const handleAssignContractor = async (pkgId) => {
    const contractor_id = selectedContractors[pkgId] || null;

    try {
      const response = await axios.put(
        `http://localhost:4000/api/packages/${pkgId}/assign-contractor`,
        { contractor_id }
      );

      setPackages((prev) =>
        prev.map((p) => (p.id === pkgId ? response.data : p))
      );
    } catch (error) {
      console.error('Greška pri dodeli izvođača:', error);
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
        <ul className="space-y-4">
          {packages.map((pkg) => (
            <li key={pkg.id} className="border p-4 rounded space-y-2">
              <div className="font-semibold text-lg">{pkg.name}</div>
              <div className="text-sm text-gray-600">{pkg.scope}</div>

              <div className="flex items-center space-x-4">
                <select
                  value={
                    selectedContractors[pkg.id] !== undefined
                      ? selectedContractors[pkg.id]
                      : pkg.contractor_id || ''
                  }
                  onChange={(e) =>
                    setSelectedContractors({
                      ...selectedContractors,
                      [pkg.id]: e.target.value === '' ? null : Number(e.target.value)
                    })
                  }
                  className="border px-3 py-2 rounded"
                >
                  <option value="">-- Bez izvođača --</option>
                  {contractors.map((contractor) => (
                    <option key={contractor.id} value={contractor.id}>
                      {contractor.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleAssignContractor(pkg.id)}
                  className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                >
                  Sačuvaj
                </button>
              </div>

              {pkg.contractor_id ? (
                <div className="text-sm text-gray-500">
                  Dodeljeni izvođač ID: {pkg.contractor_id}
                </div>
              ) : (
                <div className="text-sm text-gray-400 italic">
                  Nema dodeljenog izvođača
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConstructionPackagesTab;
import React, { useEffect, useState } from "react";
import {
  deletePackage,
  getPackages,
  postPackage,
  assignContractor,
} from "../../services/api";

const ConstructionPackagesTab = ({ projectId }) => {
  const [packages, setPackages] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [newPackage, setNewPackage] = useState({ name: "", scope: "" });
  const [selectedContractors, setSelectedContractors] = useState({});

  useEffect(() => {
    fetchPackages();
    fetchContractors();
  }, [projectId]);

  const fetchPackages = async () => {
    try {
      const data = await getPackages(projectId);
      setPackages(data);
    } catch (err) {
      console.error("Greška pri dohvatanju paketa:", err);
    }
  };

  const fetchContractors = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/projects/${projectId}/contractors`
      );
      const data = await response.json();
      setContractors(data);
    } catch (err) {
      console.error("Greška pri dohvatanju izvođača:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postPackage(projectId, newPackage);
      setNewPackage({ name: "", scope: "" });
      fetchPackages();
    } catch (err) {
      console.error("Greška pri dodavanju paketa:", err);
    }
  };

  const handleAssignContractor = async (pkgId) => {
    const contractorId = selectedContractors[pkgId];
    const cleanId = contractorId === "null" ? null : contractorId;
    try {
      await assignContractor(pkgId, cleanId);
      fetchPackages();
    } catch (err) {
      console.error("Greška pri dodeli izvođača:", err);
    }
  };

  const handleDeletePackage = async (pkgId) => {
    if (
      window.confirm(
        "Da li si siguran da želiš da obrišeš ovaj paket i sve njegove aktivnosti?"
      )
    ) {
      try {
        await deletePackage(pkgId);
        fetchPackages();
      } catch (err) {
        console.error("Greška pri brisanju paketa:", err);
      }
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Dodaj novi paket</h3>
      <form
        onSubmit={handleSubmit}
        className="space-y-2 bg-gray-50 p-4 rounded shadow"
      >
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
          placeholder="Opis radova (scope)"
          value={newPackage.scope}
          onChange={(e) =>
            setNewPackage({ ...newPackage, scope: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Dodaj paket
        </button>
      </form>

      <h3 className="text-lg font-semibold mt-6">Lista paketa</h3>
      {packages.length === 0 ? (
        <p className="text-gray-500">Nema definisanih paketa.</p>
      ) : (
        <ul className="space-y-4">
          {packages.map((pkg) => (
            <li key={pkg.id} className="border p-4 rounded shadow bg-white">
              <div className="font-semibold">{pkg.name}</div>
              <div className="text-sm text-gray-600 mb-2">{pkg.scope}</div>
              <div className="flex items-center gap-4">
                <select
                  value={selectedContractors[pkg.id] || ""}
                  onChange={(e) =>
                    setSelectedContractors((prev) => ({
                      ...prev,
                      [pkg.id]: e.target.value,
                    }))
                  }
                  className="border px-2 py-1 rounded"
                >
                  <option value="">-- Izaberi izvođača --</option>
                  <option value="null">-- Ukloni izvođača --</option>
                  {contractors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleAssignContractor(pkg.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                >
                  Dodeli izvođača
                </button>
                <button
                  onClick={() => handleDeletePackage(pkg.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                >
                  Obriši paket
                </button>
              </div>
              {pkg.contractor_id && (
                <p className="text-sm text-gray-500 mt-1">
                  Izvođač:{" "}
                  {
                    contractors.find((c) => c.id === pkg.contractor_id)
                      ?.name || "Nepoznat"
                  }
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConstructionPackagesTab;

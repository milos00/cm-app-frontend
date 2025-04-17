import React, { useEffect, useState } from "react";
import {
  deleteContractor,
  getContractors,
  addContractor,
  updateContractor,
} from "../../services/api";

const ContractorTab = ({ projectId }) => {
  const [contractors, setContractors] = useState([]);
  const [newContractor, setNewContractor] = useState({
    name: "",
    contact_person: "",
    email: "",
    phone: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    contact_person: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchContractors();
  }, [projectId]);

  const fetchContractors = async () => {
    try {
      const response = await getContractors(projectId);
      setContractors(response);
    } catch (err) {
      console.error("Greška pri dohvatanju izvođača:", err);
    }
  };

  const handleAddContractor = async (e) => {
    e.preventDefault();
    try {
      await addContractor({ ...newContractor, project_id: projectId });
      setNewContractor({ name: "", contact_person: "", email: "", phone: "" });
      fetchContractors();
    } catch (err) {
      console.error("Greška pri dodavanju izvođača:", err);
    }
  };

  const handleDeleteContractor = async (id) => {
    if (window.confirm("Da li želiš da obrišeš ovog izvođača?")) {
      try {
        await deleteContractor(id);
        fetchContractors();
      } catch (err) {
        console.error("Greška pri brisanju izvođača:", err);
      }
    }
  };

  const startEdit = (contractor) => {
    setEditingId(contractor.id);
    setEditData({
      name: contractor.name,
      contact_person: contractor.contact_person || "",
      email: contractor.email || "",
      phone: contractor.phone || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", contact_person: "", email: "", phone: "" });
  };

  const saveEdit = async (id) => {
    try {
      await updateContractor(id, editData);
      setEditingId(null);
      fetchContractors();
    } catch (err) {
      console.error("Greška pri izmeni izvođača:", err);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <form
        onSubmit={handleAddContractor}
        className="space-y-2 bg-gray-50 p-4 rounded shadow"
      >
        <h3 className="text-lg font-semibold">Dodaj izvođača</h3>
        <input
          type="text"
          placeholder="Naziv firme"
          value={newContractor.name}
          onChange={(e) =>
            setNewContractor({ ...newContractor, name: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Kontakt osoba"
          value={newContractor.contact_person}
          onChange={(e) =>
            setNewContractor({
              ...newContractor,
              contact_person: e.target.value,
            })
          }
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={newContractor.email}
          onChange={(e) =>
            setNewContractor({ ...newContractor, email: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Telefon"
          value={newContractor.phone}
          onChange={(e) =>
            setNewContractor({ ...newContractor, phone: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Dodaj
        </button>
      </form>

      <div>
        <h3 className="text-lg font-semibold mb-2">Izvođači</h3>
        {contractors.length === 0 ? (
          <p className="text-gray-500">Nema unetih izvođača.</p>
        ) : (
          <ul className="space-y-4">
            {contractors.map((contractor) => (
              <li
                key={contractor.id}
                className="border p-4 rounded bg-white shadow space-y-2"
              >
                {editingId === contractor.id ? (
                  <>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
                    <input
                      type="text"
                      value={editData.contact_person}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          contact_person: e.target.value,
                        })
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
                    <input
                      type="text"
                      value={editData.phone}
                      onChange={(e) =>
                        setEditData({ ...editData, phone: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(contractor.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                      >
                        Sačuvaj
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 text-sm"
                      >
                        Otkaži
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-semibold">{contractor.name}</div>
                    <div className="text-sm text-gray-600">
                      {contractor.contact_person}
                    </div>
                    <div className="text-sm text-gray-500">
                      {contractor.email} | {contractor.phone}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => startEdit(contractor)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                      >
                        Izmeni
                      </button>
                      <button
                        onClick={() => handleDeleteContractor(contractor.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                      >
                        Obriši
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ContractorTab;
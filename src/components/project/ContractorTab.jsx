import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ContractorTab = ({ projectId }) => {
  const [contractors, setContractors] = useState([]);
  const [newContractor, setNewContractor] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/projects/${projectId}/contractors`
        );
        setContractors(response.data);
      } catch (error) {
        console.error('Greška pri dohvatanju izvođača:', error);
      }
    };

    fetchContractors();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:4000/api/projects/${projectId}/contractors`,
        newContractor
      );
      setContractors([...contractors, response.data]);
      setNewContractor({ name: '', contact_person: '', email: '', phone: '' });
    } catch (error) {
      console.error('Greška pri dodavanju izvođača:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Izvođači</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <h3 className="text-lg font-semibold">Dodaj novog izvođača</h3>
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
              contact_person: e.target.value
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
          Dodaj izvođača
        </button>
      </form>

      {contractors.length === 0 ? (
        <p>Nema definisanih izvođača za ovaj projekat.</p>
      ) : (
        <ul className="space-y-2">
          {contractors.map((contractor) => (
            <li key={contractor.id} className="border p-3 rounded">
              <div className="font-semibold">{contractor.name}</div>
              <div className="text-sm text-gray-600">
                {contractor.contact_person} – {contractor.email} /{' '}
                {contractor.phone}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContractorTab;
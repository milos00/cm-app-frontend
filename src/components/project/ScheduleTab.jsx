import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ScheduleTab = ({ projectId }) => {
  const [activities, setActivities] = useState([]);
  const [packages, setPackages] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [newActivity, setNewActivity] = useState({
    name: '',
    start_date: '',
    end_date: '',
    duration: '',
    package_id: '',
    contractor_id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actsRes, pkgsRes, ctrsRes] = await Promise.all([
          axios.get(`http://localhost:4000/api/projects/${projectId}/activities`),
          axios.get(`http://localhost:4000/api/projects/${projectId}/packages`),
          axios.get(`http://localhost:4000/api/projects/${projectId}/contractors`)
        ]);
        setActivities(actsRes.data);
        setPackages(pkgsRes.data);
        setContractors(ctrsRes.data);
      } catch (error) {
        console.error('Greška pri dohvatanju aktivnosti:', error);
      }
    };
    fetchData();
  }, [projectId]);

  // Automatsko računanje duration i end_date
  useEffect(() => {
    const { start_date, end_date, duration } = newActivity;

    // Ako imamo start i end, računaj duration
    if (start_date && end_date && !duration) {
      const start = new Date(start_date);
      const end = new Date(end_date);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (days >= 0) {
        setNewActivity((prev) => ({ ...prev, duration: days }));
      }
    }

    // Ako imamo start i duration, računaj end
    if (start_date && duration && !end_date) {
      const start = new Date(start_date);
      const end = new Date(start);
      end.setDate(start.getDate() + Number(duration));
      setNewActivity((prev) => ({
        ...prev,
        end_date: end.toISOString().split('T')[0]
      }));
    }
  }, [newActivity.start_date, newActivity.end_date, newActivity.duration]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/activities', {
        ...newActivity,
        project_id: projectId,
        contractor_id: newActivity.contractor_id || null
      });
      setActivities([...activities, response.data]);
      setNewActivity({
        name: '',
        start_date: '',
        end_date: '',
        duration: '',
        package_id: '',
        contractor_id: ''
      });
    } catch (error) {
      console.error('Greška pri dodavanju aktivnosti:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Schedule – Aktivnosti</h2>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <h3 className="text-lg font-semibold">Dodaj novu aktivnost</h3>
        <input
          type="text"
          placeholder="Naziv aktivnosti"
          value={newActivity.name}
          onChange={(e) =>
            setNewActivity({ ...newActivity, name: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
          required
        />
        <div className="flex gap-4">
          <input
            type="date"
            value={newActivity.start_date}
            onChange={(e) =>
              setNewActivity({ ...newActivity, start_date: e.target.value, end_date: '', duration: '' })
            }
            className="border px-3 py-2 rounded w-full"
            required
          />
          <input
            type="date"
            value={newActivity.end_date}
            onChange={(e) =>
              setNewActivity({ ...newActivity, end_date: e.target.value, duration: '' })
            }
            className="border px-3 py-2 rounded w-full"
          />
        </div>
        <input
          type="number"
          placeholder="Trajanje (u danima)"
          value={newActivity.duration}
          onChange={(e) =>
            setNewActivity({ ...newActivity, duration: e.target.value, end_date: '' })
          }
          className="w-full border px-3 py-2 rounded"
        />
        <select
          value={newActivity.package_id}
          onChange={(e) =>
            setNewActivity({ ...newActivity, package_id: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">-- Izaberi paket --</option>
          {packages.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          value={newActivity.contractor_id}
          onChange={(e) =>
            setNewActivity({
              ...newActivity,
              contractor_id: e.target.value === '' ? null : e.target.value
            })
          }
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Bez izvođača --</option>
          {contractors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Dodaj aktivnost
        </button>
      </form>

      <div>
        <h3 className="text-lg font-semibold mb-2">Lista aktivnosti</h3>
        {activities.length === 0 ? (
          <p className="text-gray-500">Nema definisanih aktivnosti.</p>
        ) : (
          <ul className="space-y-3">
            {activities.map((a) => (
              <li key={a.id} className="border p-3 rounded">
                <div className="font-medium">{a.name}</div>
                <div className="text-sm text-gray-600">
                  {a.start_date} → {a.end_date} ({a.duration} dana)
                </div>
                <div className="text-sm text-gray-500 italic">
                  Paket ID: {a.package_id} | Izvođač: {a.contractor_id || '—'}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ScheduleTab;
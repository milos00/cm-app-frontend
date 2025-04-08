import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GanttChart from './GanttChart';

const ScheduleTab = ({ projectId }) => {
  const [activities, setActivities] = useState([]);
  const [packages, setPackages] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [dependenciesMap, setDependenciesMap] = useState({});
  const [newActivity, setNewActivity] = useState({
    name: '',
    start_date: '',
    end_date: '',
    duration: '',
    package_id: '',
    contractor_id: ''
  });

  const [newDependency, setNewDependency] = useState({
    from_id: '',
    to_id: '',
    type: 'FS'
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

        const dependenciesObj = {};
        for (const activity of actsRes.data) {
          const depRes = await axios.get(
            `http://localhost:4000/api/activities/${activity.id}/dependencies`
          );
          dependenciesObj[activity.id] = depRes.data;
        }
        setDependenciesMap(dependenciesObj);
      } catch (error) {
        console.error('Greška pri dohvatanju podataka:', error);
      }
    };
    fetchData();
  }, [projectId]);

  useEffect(() => {
    const { start_date, end_date, duration } = newActivity;

    if (start_date && end_date && !duration) {
      const start = new Date(start_date);
      const end = new Date(end_date);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (days >= 0) {
        setNewActivity((prev) => ({ ...prev, duration: days }));
      }
    }

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

  const handleAddDependency = async () => {
    if (!newDependency.from_id || !newDependency.to_id || !newDependency.type) return;
    try {
      await axios.post(
        `http://localhost:4000/api/activities/${newDependency.to_id}/dependencies`,
        {
          from_id: newDependency.from_id,
          type: newDependency.type
        }
      );
      const updated = await axios.get(
        `http://localhost:4000/api/activities/${newDependency.to_id}/dependencies`
      );
      setDependenciesMap((prev) => ({
        ...prev,
        [newDependency.to_id]: updated.data
      }));
      setNewDependency({ from_id: '', to_id: '', type: 'FS' });
    } catch (error) {
      console.error('Greška pri dodavanju veze:', error);
    }
  };

  const handleDeleteDependency = async (toId, depId) => {
    try {
      await axios.delete(`http://localhost:4000/api/activities/${toId}/dependencies/${depId}`);
      const updated = await axios.get(
        `http://localhost:4000/api/activities/${toId}/dependencies`
      );
      setDependenciesMap((prev) => ({
        ...prev,
        [toId]: updated.data
      }));
    } catch (error) {
      console.error('Greška pri brisanju veze:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Schedule – Aktivnosti i veze</h2>

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

      <div className="mb-6 space-y-2">
        <h3 className="text-lg font-semibold">Dodaj zavisnost između aktivnosti</h3>
        <div className="flex gap-4">
          <select
            value={newDependency.from_id}
            onChange={(e) => setNewDependency({ ...newDependency, from_id: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="">-- From (prethodna) --</option>
            {activities.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <select
            value={newDependency.to_id}
            onChange={(e) => setNewDependency({ ...newDependency, to_id: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="">-- To (zavisna) --</option>
            {activities.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <select
            value={newDependency.type}
            onChange={(e) => setNewDependency({ ...newDependency, type: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="FS">FS</option>
            <option value="SS">SS</option>
            <option value="FF">FF</option>
            <option value="SF">SF</option>
          </select>
          <button
            onClick={handleAddDependency}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Dodaj
          </button>
        </div>
      </div>

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
                {dependenciesMap[a.id]?.length > 0 && (
                  <div className="text-sm mt-2">
                    <strong>Zavisnosti:</strong>
                    <ul className="list-disc ml-4">
                      {dependenciesMap[a.id].map((dep) => (
                        <li key={dep.id} className="flex justify-between items-center">
                          {dep.type} ← Aktivnost #{dep.from_id}
                          <button
                            onClick={() => handleDeleteDependency(a.id, dep.id)}
                            className="text-red-600 text-xs"
                          >
                            obriši
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <GanttChart
        activities={activities}
        dependencies={Object.values(dependenciesMap).flat()}
      />
    </div>
  );
};

export default ScheduleTab;
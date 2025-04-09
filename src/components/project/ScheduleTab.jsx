import React, { useEffect, useState } from 'react';
import {
  getActivities,
  addActivity,
  updateActivity,
  deleteActivity,
  getDependencies,
  addDependency,
  deleteDependency,
  updateDependency,
  getContractors,
  getPackages,
} from '../../services/api';

const ScheduleTab = ({ projectId }) => {
  const [activities, setActivities] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [packages, setPackages] = useState([]);
  const [dependencies, setDependencies] = useState([]);

  const [newActivity, setNewActivity] = useState({
    name: '',
    start_date: '',
    end_date: '',
    duration: '',
    contractor_id: '',
    package_id: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    duration: '',
    contractor_id: '',
    package_id: '',
  });

  const [newDependency, setNewDependency] = useState({
    from_id: '',
    to_id: '',
    type: 'FS',
  });

  const [editingDependencyId, setEditingDependencyId] = useState(null);
  const [editDependencyData, setEditDependencyData] = useState({
    from_id: '',
    to_id: '',
    type: 'FS',
  });

  useEffect(() => {
    fetchActivities();
    fetchDependencies();
    fetchContractors();
    fetchPackages();
  }, [projectId]);

  const fetchActivities = async () => {
    try {
      const data = await getActivities(projectId);
      setActivities(data);
    } catch (err) {
      console.error('Greška pri dohvatanju aktivnosti:', err);
    }
  };

  const fetchDependencies = async () => {
    try {
      const data = await getDependencies(projectId);
      setDependencies(data);
    } catch (err) {
      console.error('Greška pri dohvatanju zavisnosti:', err);
    }
  };

  const fetchContractors = async () => {
    try {
      const data = await getContractors(projectId);
      setContractors(data);
    } catch (err) {
      console.error('Greška pri dohvatanju izvođača:', err);
    }
  };

  const fetchPackages = async () => {
    try {
      const data = await getPackages(projectId);
      setPackages(data);
    } catch (err) {
      console.error('Greška pri dohvatanju paketa:', err);
    }
  };

  const calculateDuration = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const days = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : '';
  };

  const calculateEndDate = (start, duration) => {
    const s = new Date(start);
    s.setDate(s.getDate() + parseInt(duration));
    return s.toISOString().slice(0, 10);
  };

  const handleNewChange = (field, value) => {
    const updated = { ...newActivity, [field]: value };
    if (field === 'end_date' && updated.start_date && value) {
      updated.duration = calculateDuration(updated.start_date, value);
    } else if (field === 'duration' && updated.start_date && value) {
      updated.end_date = calculateEndDate(updated.start_date, value);
    }
    setNewActivity(updated);
  };

  const handleEditChange = (field, value) => {
    const updated = { ...editData, [field]: value };
    if (field === 'end_date' && updated.start_date && value) {
      updated.duration = calculateDuration(updated.start_date, value);
    } else if (field === 'duration' && updated.start_date && value) {
      updated.end_date = calculateEndDate(updated.start_date, value);
    }
    setEditData(updated);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addActivity({ ...newActivity, project_id: projectId });
      setNewActivity({ name: '', start_date: '', end_date: '', duration: '', contractor_id: '', package_id: '' });
      fetchActivities();
    } catch (err) {
      console.error('Greška pri dodavanju aktivnosti:', err);
    }
  };

  const startEdit = (activity) => {
    setEditingId(activity.id);
    setEditData({
      name: activity.name,
      start_date: activity.start_date?.slice(0, 10) || '',
      end_date: activity.end_date?.slice(0, 10) || '',
      duration: activity.duration || '',
      contractor_id: activity.contractor_id || '',
      package_id: activity.package_id || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: '', start_date: '', end_date: '', duration: '', contractor_id: '', package_id: '' });
  };

  const saveEdit = async (id) => {
    try {
      await updateActivity(id, editData);
      setEditingId(null);
      fetchActivities();
    } catch (err) {
      console.error('Greška pri izmeni aktivnosti:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Obrisati ovu aktivnost?')) {
      try {
        await deleteActivity(id);
        fetchActivities();
        fetchDependencies();
      } catch (err) {
        console.error('Greška pri brisanju aktivnosti:', err);
      }
    }
  };

const handleAddDependency = async (e) => {
  e.preventDefault();
  try {
    await addDependency({ ...newDependency, project_id: projectId });
    setNewDependency({ from_id: '', to_id: '', type: 'FS' });
    fetchDependencies();
  } catch (err) {
    console.error('Greška pri dodavanju zavisnosti:', err);
  }
};

const handleDeleteDependency = async (id) => {
  if (window.confirm('Obrisati ovu logičku vezu?')) {
    try {
      await deleteDependency(id);
      fetchDependencies();
    } catch (err) {
      console.error('Greška pri brisanju veze:', err);
    }
  }
};

const startEditDependency = (dep) => {
  setEditingDependencyId(dep.id);
  setEditDependencyData({
    from_id: dep.from_id,
    to_id: dep.to_id,
    type: dep.type,
  });
};

const cancelEditDependency = () => {
  setEditingDependencyId(null);
  setEditDependencyData({ from_id: '', to_id: '', type: 'FS' });
};

const saveEditDependency = async (id) => {
  try {
    await updateDependency(id, editDependencyData);
    setEditingDependencyId(null);
    fetchDependencies();
  } catch (err) {
    console.error('Greška pri izmeni veze:', err);
  }
};


  return (
    <div className="p-4 space-y-6">
      <form onSubmit={handleAdd} className="bg-gray-50 p-4 rounded shadow space-y-2">
        <h3 className="text-lg font-semibold">Dodaj aktivnost</h3>

        <input
          type="text"
          placeholder="Naziv"
          value={newActivity.name}
          onChange={(e) => handleNewChange('name', e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <div className="flex gap-4">
          <input
            type="date"
            value={newActivity.start_date}
            onChange={(e) => handleNewChange('start_date', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="date"
            value={newActivity.end_date}
            onChange={(e) => handleNewChange('end_date', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <input
          type="number"
          placeholder="Trajanje (dana)"
          value={newActivity.duration}
          onChange={(e) => handleNewChange('duration', e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <select
          value={newActivity.contractor_id}
          onChange={(e) => handleNewChange('contractor_id', e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Dodeli izvođača --</option>
          {contractors.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={newActivity.package_id}
          onChange={(e) => handleNewChange('package_id', e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Dodeli paketu --</option>
          {packages.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Dodaj
        </button>
      </form>

      <div>
        <h3 className="text-lg font-semibold mb-2">Aktivnosti</h3>
        {activities.length === 0 ? (
          <p className="text-gray-500">Nema aktivnosti.</p>
        ) : (
          <ul className="space-y-4">
            {activities.map((a) => (
              <li key={a.id} className="border p-4 rounded shadow bg-white">
                {editingId === a.id ? (
                  <>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleEditChange('name', e.target.value)}
                      className="w-full border px-2 py-1 rounded mb-2"
                    />
                    <div className="flex gap-2 mb-2">
                      <input
                        type="date"
                        value={editData.start_date}
                        onChange={(e) => handleEditChange('start_date', e.target.value)}
                        className="border px-2 py-1 rounded w-full"
                      />
                      <input
                        type="date"
                        value={editData.end_date}
                        onChange={(e) => handleEditChange('end_date', e.target.value)}
                        className="border px-2 py-1 rounded w-full"
                      />
                    </div>
                    <input
                      type="number"
                      value={editData.duration}
                      onChange={(e) => handleEditChange('duration', e.target.value)}
                      className="w-full border px-2 py-1 rounded mb-2"
                    />
                    <select
                      value={editData.contractor_id}
                      onChange={(e) => handleEditChange('contractor_id', e.target.value)}
                      className="w-full border px-2 py-1 rounded mb-2"
                    >
                      <option value="">-- Bez izvođača --</option>
                      {contractors.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <select
                      value={editData.package_id}
                      onChange={(e) => handleEditChange('package_id', e.target.value)}
                      className="w-full border px-2 py-1 rounded mb-2"
                    >
                      <option value="">-- Bez paketa --</option>
                      {packages.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(a.id)}
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
                    <div className="font-semibold">{a.name}</div>
                    <div className="text-sm text-gray-600">
                      {a.start_date?.slice(0, 10)} → {a.end_date?.slice(0, 10)} | {a.duration} dana
                    </div>
                    {a.contractor_id && (
                      <div className="text-sm text-gray-500">
                        Izvođač: {contractors.find((c) => c.id === a.contractor_id)?.name || 'Nepoznat'}
                      </div>
                    )}
                    {a.package_id && (
                      <div className="text-sm text-gray-500">
                        Paket: {packages.find((p) => p.id === a.package_id)?.name || 'Nepoznat'}
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => startEdit(a)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                      >
                        Izmeni
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
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

      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-2">Logičke veze između aktivnosti</h3>

        <form onSubmit={handleAddDependency} className="bg-gray-50 p-4 rounded shadow space-y-2 mb-6">
          <h4 className="font-medium">Dodaj novu zavisnost</h4>
          <div className="flex gap-4">
            <select
              value={newDependency.from_id}
              onChange={(e) => setNewDependency({ ...newDependency, from_id: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-- Od aktivnosti --</option>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>

            <select
              value={newDependency.to_id}
              onChange={(e) => setNewDependency({ ...newDependency, to_id: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-- Ka aktivnosti --</option>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>

            <select
              value={newDependency.type}
              onChange={(e) => setNewDependency({ ...newDependency, type: e.target.value })}
              className="w-32 border px-3 py-2 rounded"
            >
              <option value="FS">FS</option>
              <option value="SS">SS</option>
              <option value="FF">FF</option>
              <option value="SF">SF</option>
            </select>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Dodaj
            </button>
          </div>
        </form>

        <ul className="space-y-2">
          {dependencies.map((d) => {
            const from = activities.find((a) => a.id === d.from_id);
            const to = activities.find((a) => a.id === d.to_id);

            if (editingDependencyId === d.id) {
              return (
                <li key={d.id} className="bg-white p-3 rounded shadow flex flex-col gap-2">
                  <div className="flex gap-2">
                    <select
                      value={editDependencyData.from_id}
                      onChange={(e) => setEditDependencyData({ ...editDependencyData, from_id: e.target.value })}
                      className="border px-2 py-1 rounded w-full"
                    >
                      {activities.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                    <select
                      value={editDependencyData.to_id}
                      onChange={(e) => setEditDependencyData({ ...editDependencyData, to_id: e.target.value })}
                      className="border px-2 py-1 rounded w-full"
                    >
                      {activities.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                    <select
                      value={editDependencyData.type}
                      onChange={(e) => setEditDependencyData({ ...editDependencyData, type: e.target.value })}
                      className="border px-2 py-1 rounded w-24"
                    >
                      <option value="FS">FS</option>
                      <option value="SS">SS</option>
                      <option value="FF">FF</option>
                      <option value="SF">SF</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => saveEditDependency(d.id)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Sačuvaj</button>
                    <button onClick={cancelEditDependency} className="bg-gray-400 text-white px-3 py-1 rounded text-sm">Otkaži</button>
                  </div>
                </li>
              );
            }

            return (
              <li key={d.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
                <span className="text-sm">{from?.name} → {to?.name} ({d.type})</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditDependency(d)}
                    className="text-yellow-600 text-sm hover:underline"
                  >
                    Izmeni
                  </button>
                  <button
                    onClick={() => handleDeleteDependency(d.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Obriši
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ScheduleTab;


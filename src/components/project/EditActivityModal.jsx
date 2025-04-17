// src/components/project/EditActivityModal.jsx

import React, { useState, useEffect } from 'react';
import { updateActivity, addDependency, deleteDependency } from '../../services/api';

const EditActivityModal = ({
  isOpen,
  onClose,
  activity,
  contractors,
  packages,
  dependencies,
  activities,
  onSave,
}) => {
  const [form, setForm] = useState({});
  const [newDep, setNewDep] = useState({ from_id: '', type: 'FS' });

  useEffect(() => {
    if (activity) {
      setForm({
        ...activity,
        start_date: activity.start_date?.slice(0, 10) || '',
        end_date: activity.end_date?.slice(0, 10) || '',
        duration: activity.duration || '',
        contractor_id: activity.contractor_id || '',
        package_id: activity.package_id || '',
      });
      setNewDep({ from_id: '', type: 'FS' });
    }
  }, [activity]);

  const calculateDuration = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = e - s;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateEndDate = (start, duration) => {
    const date = new Date(start);
    date.setDate(date.getDate() + Number(duration));
    return date.toISOString().slice(0, 10);
  };

  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value };
    if (field === 'start_date' && form.duration) {
      updated.end_date = calculateEndDate(value, form.duration);
    }
    if (field === 'end_date' && form.start_date) {
      updated.duration = calculateDuration(form.start_date, value);
    }
    if (field === 'duration' && form.start_date) {
      updated.end_date = calculateEndDate(form.start_date, value);
    }
    setForm(updated);
  };

  const handleSave = async () => {
    const cleaned = {
      ...form,
      start_date: form.start_date,
      end_date: form.end_date,
      manual_start_date: form.start_date,
      manual_end_date: form.end_date,
    };
    try {
      await updateActivity(activity.id, cleaned);
      onSave();
      onClose();
    } catch (err) {
      console.error('❌ Greška pri čuvanju aktivnosti:', err);
      alert('Greška pri čuvanju aktivnosti');
    }
  };

  const handleAddDependency = async () => {
    if (!newDep.from_id || newDep.from_id === activity.id) return;
    try {
      await addDependency({
        project_id: activity.project_id,
        from_id: newDep.from_id,
        to_id: activity.id,
        type: newDep.type,
      });
      onSave();
      setNewDep({ from_id: '', type: 'FS' });
    } catch (err) {
      console.error('Greška pri dodavanju zavisnosti:', err);
    }
  };

  const handleDeleteDependency = async (depId) => {
    try {
      await deleteDependency(depId);
      onSave();
    } catch (err) {
      console.error('Greška pri brisanju zavisnosti:', err);
    }
  };

  if (!isOpen || !activity) return null;

  const filteredDeps = dependencies?.filter((d) => Number(d.to_id) === Number(activity.id)) || [];
  const availableFroms = activities.filter((a) => a.id !== activity.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl space-y-6">
        <h2 className="text-xl font-semibold">Izmeni aktivnost</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Naziv" className="border px-3 py-2 rounded" />
          <input type="date" value={form.start_date} onChange={(e) => handleChange('start_date', e.target.value)} className="border px-3 py-2 rounded" />
          <input type="date" value={form.end_date} onChange={(e) => handleChange('end_date', e.target.value)} className="border px-3 py-2 rounded" />
          <input type="number" value={form.duration} onChange={(e) => handleChange('duration', e.target.value)} placeholder="Trajanje" className="border px-3 py-2 rounded" />
          <select value={form.contractor_id} onChange={(e) => handleChange('contractor_id', e.target.value)} className="border px-3 py-2 rounded">
            <option value="">Izvođač</option>
            {contractors.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
          <select value={form.package_id} onChange={(e) => handleChange('package_id', e.target.value)} className="border px-3 py-2 rounded">
            <option value="">Paket</option>
            {packages.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
          </select>
        </div>

        {/* 📌 Prikaz i upravljanje zavisnostima */}
        <div>
          <h3 className="font-semibold text-gray-800 mt-4">Zavisnosti</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-2">
            {filteredDeps.length > 0 ? (
              filteredDeps.map((dep) => {
                const fromActivity = activities.find((a) => a.id === dep.from_id);
                return (
                  <li key={dep.id} className="flex justify-between items-center">
                    <span>Zavisi od: {fromActivity?.name || 'Nepoznata'} ({dep.type})</span>
                    <button onClick={() => handleDeleteDependency(dep.id)} className="text-red-600 text-xs hover:underline ml-2">Obriši</button>
                  </li>
                );
              })
            ) : (
              <li className="italic text-gray-500">Nema definisanih zavisnosti.</li>
            )}
          </ul>

          {/* 📥 Dodavanje zavisnosti */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <select value={newDep.from_id} onChange={(e) => setNewDep({ ...newDep, from_id: e.target.value })} className="border px-3 py-2 rounded">
              <option value="">Zavisi od...</option>
              {availableFroms.map((a) => (<option key={a.id} value={a.id}>{a.name}</option>))}
            </select>
            <select value={newDep.type} onChange={(e) => setNewDep({ ...newDep, type: e.target.value })} className="border px-3 py-2 rounded">
              <option value="FS">Finish → Start</option>
              <option value="SS">Start → Start</option>
              <option value="FF">Finish → Finish</option>
            </select>
            <button onClick={handleAddDependency} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Dodaj zavisnost
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sačuvaj</button>
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Otkaži</button>
        </div>
      </div>
    </div>
  );
};

export default EditActivityModal;
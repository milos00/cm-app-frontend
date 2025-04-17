// src/components/project/EditActivityModal.jsx

import React, { useState, useEffect } from 'react';
import { updateActivity } from '../../services/api';

const EditActivityModal = ({
  isOpen,
  onClose,
  activity,
  contractors,
  packages,
  onSave,
}) => {
  const [form, setForm] = useState({});

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
      manual_start_date: form.start_date, // sinhronizacija za manual fallback
      manual_end_date: form.end_date,
    };

    try {
      await updateActivity(activity.id, cleaned);
      onSave(); // refetch data in parent
      onClose(); // close modal
    } catch (err) {
      console.error('❌ Greška pri čuvanju aktivnosti:', err);
      alert('Greška pri čuvanju aktivnosti');
    }
  };

  if (!isOpen || !activity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl space-y-4">
        <h2 className="text-xl font-semibold">Izmeni aktivnost</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Naziv"
            className="border px-3 py-2 rounded"
          />
          <input
            type="date"
            value={form.start_date}
            onChange={(e) => handleChange('start_date', e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <input
            type="date"
            value={form.end_date}
            onChange={(e) => handleChange('end_date', e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            value={form.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            placeholder="Trajanje"
            className="border px-3 py-2 rounded"
          />
          <select
            value={form.contractor_id}
            onChange={(e) => handleChange('contractor_id', e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">Izvođač</option>
            {contractors.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={form.package_id}
            onChange={(e) => handleChange('package_id', e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">Paket</option>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Sačuvaj
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Otkaži
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditActivityModal;
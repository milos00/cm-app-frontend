// src/components/project/ScheduleTab.jsx

import React, { useEffect, useState } from 'react';
import {
  getActivities,
  addActivity,
  getPackages,
  getContractors,
  getDependencies,
  addDependency,
  autoSchedule,
  manualSchedule,
} from '../../services/api';
import GanttChart from './GanttChart';
import EditActivityModal from './EditActivityModal';

const ScheduleTab = ({ projectId }) => {
  const [activities, setActivities] = useState([]);
  const [packages, setPackages] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [newActivity, setNewActivity] = useState({
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

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [acts, pkgs, cons, deps] = await Promise.all([
      getActivities(projectId),
      getPackages(projectId),
      getContractors(projectId),
      getDependencies(projectId),
    ]);
    setActivities(acts);
    setPackages(pkgs);
    setContractors(cons);
    setDependencies(deps);
  };

  const calculateEndDate = (startDate, duration) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + Number(duration));
    return date.toISOString().slice(0, 10);
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleNewChange = (field, value) => {
    const updated = { ...newActivity, [field]: value };
    if (field === 'start_date' && newActivity.duration) {
      updated.end_date = calculateEndDate(value, newActivity.duration);
    }
    if (field === 'end_date' && newActivity.start_date) {
      updated.duration = calculateDuration(newActivity.start_date, value);
    }
    if (field === 'duration' && newActivity.start_date) {
      updated.end_date = calculateEndDate(newActivity.start_date, value);
    }
    setNewActivity(updated);
  };

  const handleAddActivity = async () => {
    try {
      const cleaned = {
        ...newActivity,
        start_date: newActivity.start_date?.slice(0, 10),
        end_date: newActivity.end_date?.slice(0, 10),
        project_id: projectId,
      };
      await addActivity(cleaned);
      setNewActivity({
        name: '', start_date: '', end_date: '', duration: '', contractor_id: '', package_id: '',
      });
      fetchAll();
    } catch (err) {
      console.error('Greška pri dodavanju aktivnosti:', err);
    }
  };

  return (
    <div className="p-4 space-y-8">
      <div className="bg-white border p-4 rounded shadow space-y-3">
        <h2 className="text-lg font-bold">Dodaj novu aktivnost</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="text" placeholder="Naziv" value={newActivity.name} onChange={(e) => handleNewChange('name', e.target.value)} className="border px-3 py-2 rounded" />
          <input type="date" value={newActivity.start_date} onChange={(e) => handleNewChange('start_date', e.target.value)} className="border px-3 py-2 rounded" />
          <input type="date" value={newActivity.end_date} onChange={(e) => handleNewChange('end_date', e.target.value)} className="border px-3 py-2 rounded" />
          <input type="number" placeholder="Trajanje (dana)" value={newActivity.duration} onChange={(e) => handleNewChange('duration', e.target.value)} className="border px-3 py-2 rounded" />
          <select value={newActivity.contractor_id} onChange={(e) => handleNewChange('contractor_id', e.target.value)} className="border px-3 py-2 rounded">
            <option value="">Izvođač</option>
            {contractors.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
          <select value={newActivity.package_id} onChange={(e) => handleNewChange('package_id', e.target.value)} className="border px-3 py-2 rounded">
            <option value="">Paket</option>
            {packages.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
          </select>
        </div>
        <button onClick={handleAddActivity} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Dodaj</button>
      </div>

      <div className="flex gap-4 justify-end mb-4">
        <button onClick={async () => { await autoSchedule(projectId); await fetchAll(); }} className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">Auto Schedule</button>
        <button onClick={async () => { await manualSchedule(projectId); await fetchAll(); }} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Manually Schedule</button>
      </div>

      <GanttChart activities={activities} dependencies={dependencies} onActivityDoubleClick={(activity) => setSelectedActivity(activity)} />

      <EditActivityModal
  isOpen={!!selectedActivity}
  onClose={() => setSelectedActivity(null)}
  activity={selectedActivity}
  contractors={contractors}
  packages={packages}
  dependencies={dependencies}
  activities={activities}
  onSave={fetchAll}
/>

    </div>
  );
};

export default ScheduleTab;
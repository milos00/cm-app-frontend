import React, { useEffect, useState } from 'react';
import {
  getActivities,
  getDailyLogsByActivity,
  addDailyLog,
  updateDailyLog,
  deleteDailyLog,
} from '../../services/api';

const DailyLogsTab = ({ projectId }) => {
  const [activities, setActivities] = useState([]);
  const [logs, setLogs] = useState({});
  const [newLogs, setNewLogs] = useState({});
  const [editLogId, setEditLogId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (!projectId) return;
    fetchActivities();
  }, [projectId]);

  const fetchActivities = async () => {
    try {
      const data = await getActivities(projectId);
      setActivities(data);
      for (const act of data) {
        const actLogs = await getDailyLogsByActivity(act.id);
        setLogs((prev) => ({ ...prev, [act.id]: actLogs }));
      }
    } catch (err) {
      console.error('Greška pri dohvatanju aktivnosti i logova:', err);
    }
  };

  const handleNewChange = (activityId, field, value) => {
    setNewLogs((prev) => ({
      ...prev,
      [activityId]: {
        ...prev[activityId],
        [field]: value,
      },
    }));
  };

  const handleAdd = async (activityId) => {
    try {
      const log = newLogs[activityId];
      if (!log?.log_date) return;
      await addDailyLog(activityId, log);
      setNewLogs((prev) => ({ ...prev, [activityId]: {} }));
      fetchActivities();
    } catch (err) {
      console.error('Greška pri dodavanju loga:', err);
    }
  };

  const startEdit = (log) => {
    setEditLogId(log.id);
    setEditData({ ...log });
  };

  const cancelEdit = () => {
    setEditLogId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    try {
      await updateDailyLog(editLogId, editData);
      setEditLogId(null);
      fetchActivities();
    } catch (err) {
      console.error('Greška pri izmeni loga:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Obrisati log?')) {
      try {
        await deleteDailyLog(id);
        fetchActivities();
      } catch (err) {
        console.error('Greška pri brisanju loga:', err);
      }
    }
  };

  return (
    <div className="p-4 space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="border-b pb-4">
          <h4 className="font-semibold">{activity.name}</h4>

          <div className="space-y-1 mt-2">
            {(logs[activity.id] || []).map((log) => (
              <div key={log.id} className="bg-gray-50 p-3 rounded shadow text-sm">
                {editLogId === log.id ? (
                  <>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="date"
                        value={editData.log_date?.slice(0, 10) || ''}
                        onChange={(e) => setEditData({ ...editData, log_date: e.target.value })}
                        className="border px-2 py-1 rounded"
                      />
                      <input
                        type="number"
                        value={editData.progress_percentage}
                        onChange={(e) => setEditData({ ...editData, progress_percentage: e.target.value })}
                        placeholder="%"
                        className="border px-2 py-1 rounded w-24"
                      />
                      <select
                        value={editData.supervisor_approved}
                        onChange={(e) => setEditData({ ...editData, supervisor_approved: e.target.value })}
                        className="border px-2 py-1 rounded"
                      >
                        <option value="">Status</option>
                        <option value="yes">Yes</option>
                        <option value="not_yet">Not yet</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="w-full border px-2 py-1 rounded mb-2"
                      placeholder="Opis"
                    />
                    <textarea
                      value={editData.supervisor_comment}
                      onChange={(e) => setEditData({ ...editData, supervisor_comment: e.target.value })}
                      className="w-full border px-2 py-1 rounded mb-2"
                      placeholder="Komentar nadzora"
                    />
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Sačuvaj</button>
                      <button onClick={cancelEdit} className="bg-gray-400 text-white px-3 py-1 rounded text-sm">Otkaži</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div><strong>{log.log_date?.slice(0, 10)}</strong> – {log.progress_percentage || 0}%</div>
                    <div className="text-gray-700 italic">{log.description}</div>
                    {log.supervisor_approved && (
                      <div className="text-xs text-gray-600">
                        Status: {log.supervisor_approved} {log.supervisor_comment ? `– ${log.supervisor_comment}` : ''}
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => startEdit(log)} className="text-yellow-600 text-sm hover:underline">Izmeni</button>
                      <button onClick={() => handleDelete(log.id)} className="text-red-600 text-sm hover:underline">Obriši</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleAdd(activity.id); }} className="mt-4 bg-white border p-4 rounded shadow space-y-2">
            <h5 className="font-medium text-sm">Dodaj dnevni log</h5>
            <input
              type="date"
              value={newLogs[activity.id]?.log_date || ''}
              onChange={(e) => handleNewChange(activity.id, 'log_date', e.target.value)}
              className="w-full border px-2 py-1 rounded"
              required
            />
            <input
              type="number"
              placeholder="Procenat (%)"
              value={newLogs[activity.id]?.progress_percentage || ''}
              onChange={(e) => handleNewChange(activity.id, 'progress_percentage', e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
            <textarea
              placeholder="Opis radova"
              value={newLogs[activity.id]?.description || ''}
              onChange={(e) => handleNewChange(activity.id, 'description', e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
            <select
              value={newLogs[activity.id]?.supervisor_approved || ''}
              onChange={(e) => handleNewChange(activity.id, 'supervisor_approved', e.target.value)}
              className="w-full border px-2 py-1 rounded"
            >
              <option value="">Odobrenje nadzora</option>
              <option value="yes">Yes</option>
              <option value="not_yet">Not yet</option>
              <option value="no">No</option>
            </select>
            <textarea
              placeholder="Komentar nadzora"
              value={newLogs[activity.id]?.supervisor_comment || ''}
              onChange={(e) => handleNewChange(activity.id, 'supervisor_comment', e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Dodaj log
            </button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default DailyLogsTab;
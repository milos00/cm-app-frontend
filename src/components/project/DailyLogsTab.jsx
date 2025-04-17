import React, { useEffect, useState } from 'react';
import {
  getActivities,
  getDailyLogsByActivity,
  addDailyLog,
  updateDailyLog,
  deleteDailyLog,
} from '../../services/api';

const DailyLogsTab = ({ projectId, refreshActivities }) => {
  const [activities, setActivities] = useState([]);
  const [logs, setLogs] = useState({});
  const [openAccordions, setOpenAccordions] = useState({});
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
      const allLogs = {};
      for (const act of data) {
        const actLogs = await getDailyLogsByActivity(act.id);
        allLogs[act.id] = actLogs.sort((a, b) => b.log_date.localeCompare(a.log_date));
      }
      setLogs(allLogs);
    } catch (err) {
      console.error('Greška pri dohvatanju aktivnosti i logova:', err);
    }
  };

  const toggleAccordion = (activityId) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [activityId]: !prev[activityId],
    }));
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

      await addDailyLog(activityId, {
        ...log,
        log_date: log.log_date,
      });

      setNewLogs((prev) => ({ ...prev, [activityId]: {} }));
      fetchActivities();
      refreshActivities();
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
      refreshActivities();
    } catch (err) {
      console.error('Greška pri izmeni loga:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Obrisati log?')) {
      try {
        await deleteDailyLog(id);
        fetchActivities();
        refreshActivities();
      } catch (err) {
        console.error('Greška pri brisanju loga:', err);
      }
    }
  };

  return (
    <div className="p-4 space-y-6">
      {activities.map((activity) => (
        <div key={activity.id} className="border rounded shadow">
          <button
            onClick={() => toggleAccordion(activity.id)}
            className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 font-semibold"
          >
            {activity.name}
          </button>

          {openAccordions[activity.id] && (
            <div className="p-4 space-y-4">
              <table className="w-full text-sm table-auto border">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="border px-2 py-1">Datum</th>
                    <th className="border px-2 py-1">Procenat</th>
                    <th className="border px-2 py-1">Opis</th>
                    <th className="border px-2 py-1">Status</th>
                    <th className="border px-2 py-1">Komentar</th>
                    <th className="border px-2 py-1">Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {(logs[activity.id] || []).map((log) => (
                    <tr key={log.id}>
                      {editLogId === log.id ? (
                        <>
                          <td className="border px-2 py-1">
                            <input
                              type="date"
                              value={editData.log_date?.slice(0, 10) || ''}
                              onChange={(e) =>
                                setEditData({ ...editData, log_date: e.target.value })
                              }
                              className="w-full border px-2 py-1 rounded"
                            />
                          </td>
                          <td className="border px-2 py-1">
                            <input
                              type="number"
                              value={editData.progress_percentage}
                              onChange={(e) =>
                                setEditData({ ...editData, progress_percentage: e.target.value })
                              }
                              className="w-full border px-2 py-1 rounded"
                            />
                          </td>
                          <td className="border px-2 py-1">
                            <textarea
                              value={editData.description}
                              onChange={(e) =>
                                setEditData({ ...editData, description: e.target.value })
                              }
                              className="w-full border px-2 py-1 rounded"
                            />
                          </td>
                          <td className="border px-2 py-1">
                            <select
                              value={editData.supervisor_approved}
                              onChange={(e) =>
                                setEditData({ ...editData, supervisor_approved: e.target.value })
                              }
                              className="w-full border px-2 py-1 rounded"
                            >
                              <option value="">Status</option>
                              <option value="yes">Yes</option>
                              <option value="not_yet">Not yet</option>
                              <option value="no">No</option>
                            </select>
                          </td>
                          <td className="border px-2 py-1">
                            <textarea
                              value={editData.supervisor_comment}
                              onChange={(e) =>
                                setEditData({ ...editData, supervisor_comment: e.target.value })
                              }
                              className="w-full border px-2 py-1 rounded"
                            />
                          </td>
                          <td className="border px-2 py-1 space-x-2">
                            <button onClick={saveEdit} className="text-green-600 hover:underline">Sačuvaj</button>
                            <button onClick={cancelEdit} className="text-gray-500 hover:underline">Otkaži</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="border px-2 py-1">{log.log_date?.slice(0, 10)}</td>
                          <td className="border px-2 py-1">{log.progress_percentage || 0}%</td>
                          <td className="border px-2 py-1 italic">{log.description}</td>
                          <td className="border px-2 py-1">{log.supervisor_approved}</td>
                          <td className="border px-2 py-1">{log.supervisor_comment}</td>
                          <td className="border px-2 py-1 space-x-2">
                            <button onClick={() => startEdit(log)} className="text-yellow-600 hover:underline">Izmeni</button>
                            <button onClick={() => handleDelete(log.id)} className="text-red-600 hover:underline">Obriši</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAdd(activity.id);
                }}
                className="space-y-2 pt-4 border-t"
              >
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
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Dodaj log
                </button>
              </form>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DailyLogsTab;
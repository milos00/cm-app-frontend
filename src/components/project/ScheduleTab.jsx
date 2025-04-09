import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ScheduleTab = ({ projectId }) => {
  const [activities, setActivities] = useState([]);
  const [packages, setPackages] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [dailyLogs, setDailyLogs] = useState({});
  const [newActivity, setNewActivity] = useState({
    name: '',
    start_date: '',
    end_date: '',
    duration: '',
    package_id: '',
    contractor_id: ''
  });

  const [newLog, setNewLog] = useState({}); // Logovi po activityId

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

        const logsObj = {};
        for (const activity of actsRes.data) {
          const logsRes = await axios.get(
            `http://localhost:4000/api/activities/${activity.id}/daily-logs`
          );
          logsObj[activity.id] = logsRes.data;
        }
        setDailyLogs(logsObj);
      } catch (error) {
        console.error('Greška pri dohvatanju podataka:', error);
      }
    };
    fetchData();
  }, [projectId]);

  const handleActivitySubmit = async (e) => {
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

  const handleLogSubmit = async (activityId) => {
    const log = newLog[activityId];
    if (!log || !log.description || !log.progress_percentage || !log.supervisor_approved) return;

    try {
      const res = await axios.post(
        `http://localhost:4000/api/activities/${activityId}/daily-logs`,
        {
          description: log.description,
          progress_percentage: log.progress_percentage,
          supervisor_approved: log.supervisor_approved,
          supervisor_comment: log.supervisor_comment || ''
        }
      );
      const updatedLogs = await axios.get(
        `http://localhost:4000/api/activities/${activityId}/daily-logs`
      );
      setDailyLogs((prev) => ({
        ...prev,
        [activityId]: updatedLogs.data
      }));
      setNewLog((prev) => ({ ...prev, [activityId]: {} }));
    } catch (err) {
      console.error('Greška pri unosu dnevnog loga:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Schedule – Aktivnosti i dnevni logovi</h2>

      <form onSubmit={handleActivitySubmit} className="space-y-2 mb-6">
  <h3 className="text-lg font-semibold">Dodaj novu aktivnost</h3>

  <input
    type="text"
    placeholder="Naziv aktivnosti"
    value={newActivity.name}
    onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
    className="w-full border px-3 py-2 rounded"
    required
  />

  <div className="flex gap-4">
    <input
      type="date"
      value={newActivity.start_date}
      onChange={(e) => {
        const startDate = e.target.value;
        const { end_date, duration } = newActivity;

        let newEndDate = end_date;
        if (duration && startDate) {
          const s = new Date(startDate);
          s.setDate(s.getDate() + parseInt(duration, 10));
          newEndDate = s.toISOString().split('T')[0];
        }

        setNewActivity({ ...newActivity, start_date: startDate, end_date: newEndDate });
      }}
      className="border px-3 py-2 rounded w-full"
      required
    />

    <input
      type="date"
      value={newActivity.end_date}
      onChange={(e) => {
        const endDate = e.target.value;
        const { start_date } = newActivity;

        let calculatedDuration = '';
        if (start_date && endDate) {
          const start = new Date(start_date);
          const end = new Date(endDate);
          const diffTime = Math.abs(end - start);
          calculatedDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // broj dana
        }

        setNewActivity({ ...newActivity, end_date: endDate, duration: calculatedDuration });
      }}
      className="border px-3 py-2 rounded w-full"
    />
  </div>

  <input
    type="number"
    placeholder="Trajanje (u danima)"
    value={newActivity.duration}
    onChange={(e) => {
      const dur = e.target.value;
      const { start_date } = newActivity;

      let newEndDate = '';
      if (start_date && dur) {
        const s = new Date(start_date);
        s.setDate(s.getDate() + parseInt(dur, 10));
        newEndDate = s.toISOString().split('T')[0];
      }

      setNewActivity({ ...newActivity, duration: dur, end_date: newEndDate });
    }}
    className="w-full border px-3 py-2 rounded"
  />

  <select
    value={newActivity.package_id}
    onChange={(e) => setNewActivity({ ...newActivity, package_id: e.target.value })}
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
        <h3 className="text-lg font-semibold mb-2">Aktivnosti i dnevni logovi</h3>
        {activities.length === 0 ? (
          <p className="text-gray-500">Nema aktivnosti.</p>
        ) : (
          <ul className="space-y-4">
            {activities.map((a) => (
              <li key={a.id} className="border p-4 rounded shadow-sm bg-white">
                <div className="font-semibold">{a.name}</div>
                <div className="text-sm text-gray-600 mb-2">
                  {a.start_date} → {a.end_date} | Trajanje: {a.duration} dana
                </div>

                <div className="text-sm mb-2">
                  <strong>Dnevni logovi:</strong>
                  {dailyLogs[a.id]?.length > 0 ? (
                    <ul className="ml-4 list-disc text-gray-700">
                      {dailyLogs[a.id].map((log) => (
                        <li key={log.id}>
                          <strong>{log.log_date}:</strong> {log.description} ({log.progress_percentage}%)
                          — Supervisor: {log.supervisor_approved}
                          {log.supervisor_comment && (
                            <div className="text-xs text-gray-500 italic">
                              Komentar: {log.supervisor_comment}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm">Nema unosa.</p>
                  )}
                </div>

                <div className="mt-2">
                  <h4 className="font-medium text-sm mb-1">Novi dnevni log:</h4>
                  <textarea
                    placeholder="Opis napretka"
                    value={newLog[a.id]?.description || ''}
                    onChange={(e) =>
                      setNewLog((prev) => ({
                        ...prev,
                        [a.id]: { ...prev[a.id], description: e.target.value }
                      }))
                    }
                    className="w-full border px-3 py-2 rounded mb-2"
                  />
                  <div className="flex gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="%"
                      value={newLog[a.id]?.progress_percentage || ''}
                      onChange={(e) =>
                        setNewLog((prev) => ({
                          ...prev,
                          [a.id]: { ...prev[a.id], progress_percentage: e.target.value }
                        }))
                      }
                      className="w-24 border px-2 py-1 rounded"
                    />
                    <select
                      value={newLog[a.id]?.supervisor_approved || ''}
                      onChange={(e) =>
                        setNewLog((prev) => ({
                          ...prev,
                          [a.id]: { ...prev[a.id], supervisor_approved: e.target.value }
                        }))
                      }
                      className="border px-2 py-1 rounded"
                    >
                      <option value="">Odobrenje nadzora</option>
                      <option value="yes">Yes</option>
                      <option value="yes with a comment">Yes with a comment</option>
                      <option value="not yet">Not yet</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  {newLog[a.id]?.supervisor_approved === 'yes with a comment' && (
                    <input
                      type="text"
                      placeholder="Komentar nadzora"
                      value={newLog[a.id]?.supervisor_comment || ''}
                      onChange={(e) =>
                        setNewLog((prev) => ({
                          ...prev,
                          [a.id]: { ...prev[a.id], supervisor_comment: e.target.value }
                        }))
                      }
                      className="w-full border px-3 py-2 rounded mb-2"
                    />
                  )}
                  <button
                    onClick={() => handleLogSubmit(a.id)}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
                  >
                    Sačuvaj log
                  </button>
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
import React, { useEffect, useRef } from 'react';
import Gantt from 'frappe-gantt';

const GanttChart = ({ activities, dependencies }) => {
  const ganttRef = useRef(null);

  useEffect(() => {
    if (!ganttRef.current) return;

    const tasks = activities.map((activity) => ({
      id: String(activity.id),
      name: activity.name,
      start: activity.start_date,
      end: activity.end_date,
      progress: 0,
      custom_class: `pkg-${activity.package_id}`
    }));

    const dependencyMap = {};
    dependencies.forEach((dep) => {
      const targetId = String(dep.to_id);
      if (!dependencyMap[targetId]) dependencyMap[targetId] = [];
      dependencyMap[targetId].push(String(dep.from_id));
    });

    tasks.forEach((task) => {
      const deps = dependencyMap[task.id];
      if (deps) task.dependencies = deps.join(',');
    });

    // Očisti prethodni sadržaj
    ganttRef.current.innerHTML = '';

    new Gantt(ganttRef.current, tasks, {
      view_mode: 'Day',
      language: 'en',
      custom_popup_html: null
    });
  }, [activities, dependencies]);

  return (
    <div>
      <h3 className="text-lg font-semibold my-4">Gantt prikaz</h3>
      <div ref={ganttRef} />
    </div>
  );
};

export default GanttChart;
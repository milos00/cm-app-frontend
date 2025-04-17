// src/components/project/GanttChart.jsx

import React, { useEffect, useState } from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';

const GanttChart = ({ activities, dependencies, onActivityDoubleClick }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!activities.length) return;

    const mappedTasks = activities
      .slice() // kopiramo niz
      .sort((a, b) => a.id - b.id) // sortiramo po redosledu unosa (niži id -> ranije)
      .filter((a) => {
        const valid =
          a.start_date &&
          a.end_date &&
          !isNaN(new Date(a.start_date)) &&
          !isNaN(new Date(a.end_date));
        if (!valid) {
          console.warn('⛔ Preskačem nevalidnu aktivnost:', a);
        }
        return valid;
      })
      .map((a) => {
        const start = new Date(a.start_date);
        const end = new Date(a.end_date);

        return {
          id: String(a.id),
          name: a.name,
          start,
          end,
          type: 'task',
          progress: a.progress || 0,
          isDisabled: false,
          activityData: a, // čuvamo punu aktivnost za kasnije (modal)
          styles: {
            backgroundColor: '#4f46e5',
            progressColor: '#22c55e',
          },
        };
      });

    const validTaskIds = new Set(mappedTasks.map((t) => t.id));

    dependencies.forEach((dep) => {
      const toId = String(dep.to_id);
      const fromId = String(dep.from_id);

      const toTask = mappedTasks.find((t) => t.id === toId);
      const fromExists = validTaskIds.has(fromId);

      if (toTask && fromExists) {
        if (!toTask.dependencies) toTask.dependencies = [];
        toTask.dependencies.push(fromId);
      } else {
        console.warn('⚠️ Preskačem nevažeću zavisnost:', dep);
      }
    });

    setTasks(mappedTasks);
  }, [activities, dependencies]);

  const handleDoubleClick = (task) => {
    if (onActivityDoubleClick && task.activityData) {
      onActivityDoubleClick(task.activityData);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Gantt dijagram</h3>
      <div style={{ height: 500 }}>
        {tasks.length > 0 ? (
          <Gantt
            tasks={tasks}
            viewMode={ViewMode.Week}
            listCellWidth="200px"
            locale="sr-Latn"
            fontFamily="sans-serif"
            onDoubleClick={handleDoubleClick}
          />
        ) : (
          <div className="text-sm text-gray-500 italic">
            Nema validnih aktivnosti za prikaz.
          </div>
        )}
      </div>
    </div>
  );
};

export default GanttChart;
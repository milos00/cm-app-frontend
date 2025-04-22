// src/components/project/GanttChart.jsx

import React, { useEffect, useState, useRef } from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';

const GanttChart = ({ activities, dependencies, onActivityDoubleClick }) => {
  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState(ViewMode.Week);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, activity: null });
  const ganttRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!activities.length) return;

    const mappedTasks = [...activities]
      .sort((a, b) => a.id - b.id)
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

        const tooltipLines = [
          `<b>${a.name}</b>`,
          a.package_name && `Paket: ${a.package_name}`,
          a.contractor_name && `Izvođač: ${a.contractor_name}`,
          `Početak: ${a.start_date}`,
          `Kraj: ${a.end_date}`,
          a.progress !== undefined ? `Napredak: ${a.progress}%` : null,
          a.status ? `Status: ${a.status}` : null,
          a.comments ? `Beleška: ${a.comments}` : null
        ].filter(Boolean);

        return {
          id: String(a.id),
          name: a.name,
          start,
          end,
          type: 'task',
          progress: a.progress || 0,
          isDisabled: false,
          activityData: a,
          styles: {
            backgroundColor: '#4f46e5',
            progressColor: '#22c55e',
          },
          tooltip: tooltipLines.join('<br/>')
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

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, activity: null });
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;

    const taskRect = el.closest('g[data-id]');
    if (!taskRect || !taskRect.getAttribute('data-id')) return;

    const id = taskRect.getAttribute('data-id');
    const match = tasks.find((t) => t.id === id);
    if (!match) return;

    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, activity: match.activityData });
  };

  useEffect(() => {
    const ref = containerRef.current;
    if (ref) ref.addEventListener('contextmenu', handleContextMenu);
    return () => {
      if (ref) ref.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [tasks]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) closeContextMenu();
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [contextMenu.visible]);

  return (
    <div className="mt-6 relative" ref={containerRef}>
      <h3 className="text-lg font-semibold mb-2">Gantt dijagram</h3>

      <div className="flex gap-3 mb-3">
        <button
          onClick={() => setViewMode(ViewMode.Day)}
          className={`px-3 py-1 rounded border ${viewMode === ViewMode.Day ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}
        >Dnevni</button>
        <button
          onClick={() => setViewMode(ViewMode.Week)}
          className={`px-3 py-1 rounded border ${viewMode === ViewMode.Week ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}
        >Nedeljni</button>
        <button
          onClick={() => setViewMode(ViewMode.Month)}
          className={`px-3 py-1 rounded border ${viewMode === ViewMode.Month ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}
        >Mesečni</button>
      </div>

      <div style={{ height: 500 }}>
        {tasks.length > 0 ? (
          <Gantt
            tasks={tasks}
            viewMode={viewMode}
            listCellWidth="200px"
            locale="en"
            fontFamily="sans-serif"
            onDoubleClick={handleDoubleClick}
            ref={ganttRef}
          />
        ) : (
          <div className="text-sm text-gray-500 italic">Nema validnih aktivnosti za prikaz.</div>
        )}
      </div>

      {contextMenu.visible && (
        <div
          className="absolute bg-white border rounded shadow p-2 text-sm space-y-1 z-50"
          style={{ top: contextMenu.y, left: contextMenu.x, minWidth: '150px' }}
        >
          <button
            onClick={() => {
              onActivityDoubleClick(contextMenu.activity);
              closeContextMenu();
            }}
            className="w-full text-left px-2 py-1 hover:bg-gray-100"
          >Izmeni aktivnost</button>
          <button
            onClick={() => {
              alert(`Obriši: ${contextMenu.activity.name}`);
              closeContextMenu();
            }}
            className="w-full text-left px-2 py-1 hover:bg-gray-100 text-red-600"
          >Obriši aktivnost</button>
          <button
            onClick={() => {
              alert(`Dodaj zavisnost za: ${contextMenu.activity.name}`);
              closeContextMenu();
            }}
            className="w-full text-left px-2 py-1 hover:bg-gray-100"
          >Dodaj zavisnost</button>
        </div>
      )}
    </div>
  );
};

export default GanttChart;
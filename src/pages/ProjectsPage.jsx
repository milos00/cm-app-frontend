import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProjects,
  addProject,
  deleteProject,
  updateProject,
} from "../services/api";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    name: "",
    location: "",
    description: "",
  });
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editData, setEditData] = useState({ name: "", location: "", description: "" });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Greška pri dohvatanju projekata: ", error);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      await addProject(newProject);
      setNewProject({ name: "", location: "", description: "" });
      fetchProjects();
    } catch (error) {
      console.error("Greška pri dodavanju projekta: ", error);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Da li si siguran da želiš da obrišeš ovaj projekat?")) {
      try {
        await deleteProject(id);
        fetchProjects();
      } catch (error) {
        console.error("Greška pri brisanju projekta: ", error);
      }
    }
  };

  const startEdit = (project) => {
    setEditingProjectId(project.id);
    setEditData({
      name: project.name,
      location: project.location,
      description: project.description,
    });
  };

  const cancelEdit = () => {
    setEditingProjectId(null);
    setEditData({ name: "", location: "", description: "" });
  };

  const saveEdit = async (id) => {
    try {
      await updateProject(id, editData);
      setEditingProjectId(null);
      fetchProjects();
    } catch (error) {
      console.error("Greška pri izmeni projekta: ", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Svi projekti</h2>

      <form onSubmit={handleAddProject} className="mb-6 space-y-2 bg-gray-50 p-4 rounded shadow">
        <h3 className="text-lg font-semibold">Dodaj novi projekat</h3>
        <input
          type="text"
          placeholder="Naziv"
          value={newProject.name}
          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Lokacija"
          value={newProject.location}
          onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          placeholder="Opis"
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Dodaj projekat
        </button>
      </form>

      <ul className="space-y-4">
        {projects.map((project) => (
          <li
            key={project.id}
            className="border p-4 rounded bg-white shadow space-y-2"
          >
            {editingProjectId === project.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Naziv"
                />
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Lokacija"
                />
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Opis"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(project.id)}
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
              </div>
            ) : (
              <>
                <div className="text-lg font-semibold">{project.name}</div>
                <div className="text-sm text-gray-600">{project.location}</div>
                <div className="text-sm text-gray-500">{project.description}</div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                  >
                    Detalji
                  </button>
                  <button
                    onClick={() => startEdit(project)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                  >
                    Izmeni
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
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
    </div>
  );
};

export default ProjectsPage;
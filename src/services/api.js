import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api',
});

export const getProjects = async () => {
  const response = await API.get('/projects');
  return response.data;
};

export const addProject = async (project) => {
  const response = await fetch("http://localhost:4000/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  if (!response.ok) throw new Error("Greška pri unosu projekta");
  return await response.json();
};

export const deleteProject = async (id) => {
  const response = await fetch(`http://localhost:4000/api/projects/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Greška pri brisanju projekta");
};


// Projekti
export const getProjects = async () => {
  const response = await fetch("http://localhost:4000/api/projects");
  if (!response.ok) throw new Error("Greška pri dohvatanju projekata");
  return await response.json();
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

export const updateProject = async (id, data) => {
  const response = await fetch(`http://localhost:4000/api/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Greška pri izmeni projekta");
  return await response.json();
};


// Paketi
export const getPackages = async (projectId) => {
  const response = await fetch(`http://localhost:4000/api/projects/${projectId}/packages`);
  if (!response.ok) throw new Error("Greška pri dohvatanju paketa");
  return await response.json();
};

export const postPackage = async (projectId, pkg) => {
  const response = await fetch(`http://localhost:4000/api/projects/${projectId}/packages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pkg),
  });
  if (!response.ok) throw new Error("Greška pri unosu paketa");
  return await response.json();
};

export const deletePackage = async (id) => {
  const response = await fetch(`http://localhost:4000/api/packages/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Greška pri brisanju paketa");
};

export const assignContractor = async (packageId, contractorId) => {
  const response = await fetch(`http://localhost:4000/api/packages/${packageId}/assign-contractor`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contractor_id: contractorId }),
  });
  if (!response.ok) throw new Error("Greška pri dodeli izvođača");
};

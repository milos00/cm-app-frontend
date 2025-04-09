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

export const updatePackage = async (id, data) => {
  const response = await fetch(`http://localhost:4000/api/packages/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Greška pri izmeni paketa");
  return await response.json();
};

// Izvodjaci

export const updateContractor = async (id, data) => {
  const res = await fetch(`http://localhost:4000/api/contractors/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Greška pri izmeni izvođača");
  return await res.json();
};

export const deleteContractor = async (id) => {
  const res = await fetch(`http://localhost:4000/api/contractors/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Greška pri brisanju izvođača");
};

export const addContractor = async (contractor) => {
  const response = await fetch("http://localhost:4000/api/contractors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contractor),
  });
  if (!response.ok) throw new Error("Greška pri unosu izvođača");
  return await response.json();
};

export const getContractors = async (projectId) => {
  const response = await fetch(`http://localhost:4000/api/projects/${projectId}/contractors`);
  if (!response.ok) throw new Error("Greška pri dohvatanju izvođača");
  return await response.json();
};

// Aktivnosti

export const updateActivity = async (id, data) => {
  const response = await fetch(`http://localhost:4000/api/activities/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Greška pri izmeni aktivnosti");
  return await response.json();
};

export const deleteActivity = async (id) => {
  const response = await fetch(`http://localhost:4000/api/activities/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Greška pri brisanju aktivnosti");
};

export const getActivities = async (projectId) => {
  const response = await fetch(`http://localhost:4000/api/projects/${projectId}/activities`);
  if (!response.ok) throw new Error("Greška pri dohvatanju aktivnosti");
  return await response.json();
};

export const addActivity = async (activity) => {
  const response = await fetch("http://localhost:4000/api/activities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(activity),
  });
  if (!response.ok) throw new Error("Greška pri dodavanju aktivnosti");
  return await response.json();
};


// dependencies 

export const getDependencies = async (projectId) => {
  const response = await fetch(`http://localhost:4000/api/projects/${projectId}/dependencies`);
  if (!response.ok) throw new Error("Greška pri dohvatanju zavisnosti");
  return await response.json();
};

export const addDependency = async (dependency) => {
  const response = await fetch("http://localhost:4000/api/dependencies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dependency),
  });
  if (!response.ok) throw new Error("Greška pri dodavanju zavisnosti");
  return await response.json();
};

export const deleteDependency = async (id) => {
  const response = await fetch(`http://localhost:4000/api/dependencies/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Greška pri brisanju zavisnosti");
};

export const updateDependency = async (id, data) => {
  const response = await fetch(`http://localhost:4000/api/dependencies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Greška pri izmeni zavisnosti");
  return await response.json();
};

// === DAILY LOGS ===

export const getDailyLogsByActivity = async (activityId) => {
  const res = await fetch(`http://localhost:4000/api/activities/${activityId}/daily-logs`);
  if (!res.ok) throw new Error('Greška pri dohvatanju dnevnih logova');
  return await res.json();
};

export const addDailyLog = async (activityId, logData) => {
  const res = await fetch(`http://localhost:4000/api/activities/${activityId}/daily-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logData),
  });
  if (!res.ok) throw new Error('Greška pri dodavanju dnevnog loga');
  return await res.json();
};

export const updateDailyLog = async (logId, logData) => {
  const res = await fetch(`http://localhost:4000/api/daily-logs/${logId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logData),
  });
  if (!res.ok) throw new Error('Greška pri izmeni dnevnog loga');
  return await res.json();
};

export const deleteDailyLog = async (logId) => {
  const res = await fetch(`http://localhost:4000/api/daily-logs/${logId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Greška pri brisanju dnevnog loga');
};











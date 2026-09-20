const BASE_URL = "http://localhost:5000";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401 && token) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export const getTasks = () => apiFetch("/tasks");

export const createTask = (task) =>
  apiFetch("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });

export const updateTask = (id, task) =>
  apiFetch(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(task),
  });

export const deleteTask = (id) =>
  apiFetch(`/tasks/${id}`, {
    method: "DELETE",
  });

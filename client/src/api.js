const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3001"
).replace(/\/+$/, "");

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_API_KEY || "",
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Не удалось связаться с сервером. Проверьте подключение.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Сервер вернул ошибку");
  }

  return data;
}

export const getTasks = () => request("/api/tasks");

export const createTask = (title) =>
  request("/api/tasks", {
    method: "POST",
    body: JSON.stringify({ title }),
  });

export const updateTask = (id, completed) =>
  request(`/api/tasks/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify({ completed }),
  });

export const deleteTask = (id) =>
  request(`/api/tasks/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
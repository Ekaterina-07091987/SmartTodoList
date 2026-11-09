import { useEffect, useMemo, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "./api";
import { FilterButtons, TaskForm, TaskList } from "./components";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(title) {
    setError("");

    try {
      const task = await createTask(title);
      setTasks((current) => [task, ...current]);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleToggle(id, completed) {
    setError("");

    try {
      const updatedTask = await updateTask(id, completed);
      setTasks((current) =>
        current.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleDelete(id) {
    setError("");

    try {
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task.id !== id));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const visibleTasks = useMemo(() => {
    if (filter === "active") {
      return tasks.filter((task) => !task.completed);
    }

    if (filter === "completed") {
      return tasks.filter((task) => task.completed);
    }

    return tasks;
  }, [tasks, filter]);

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="page">
      <section className="todo-card">
        <header className="page-header">
          <p className="eyebrow">Планируйте день</p>
          <h1>Умный список задач</h1>
          <p className="subtitle">
            Добавляйте дела, отмечайте выполненное и следите за прогрессом.
          </p>
        </header>

        <TaskForm onAdd={handleAdd} disabled={loading} />

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        <div className="list-heading">
          <h2>Мои задачи</h2>
          <span className="progress">
            Выполнено: {completedCount} из {tasks.length}
          </span>
        </div>

        <FilterButtons filter={filter} onChange={setFilter} />

        {loading ? (
          <p className="empty-state" role="status">
            Загрузка задач…
          </p>
        ) : (
          <TaskList
            tasks={visibleTasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
      </section>
    </main>
  );
}
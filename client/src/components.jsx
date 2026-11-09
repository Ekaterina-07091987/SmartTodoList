import { useState } from "react";

export function TaskForm({ onAdd, disabled = false }) {
  const [title, setTitle] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    await onAdd(trimmedTitle);
    setTitle("");
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="task-title">
        Новая задача
      </label>

      <input
        id="task-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Например, подготовить проект"
        maxLength={200}
        disabled={disabled}
      />

      <button type="submit" disabled={disabled || !title.trim()}>
        Добавить
      </button>
    </form>
  );
}

export function FilterButtons({ filter, onChange }) {
  const filters = [
    ["all", "Все"],
    ["active", "Активные"],
    ["completed", "Завершённые"],
  ];

  return (
    <div className="filters" aria-label="Фильтры задач">
      {filters.map(([value, label]) => (
        <button
          key={value}
          type="button"
          className={filter === value ? "filter-button selected" : "filter-button"}
          aria-pressed={filter === value}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty-state">Задач пока нет.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li className="task-item" key={task.id}>
          <label className={task.completed ? "task-title completed" : "task-title"}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(event) => onToggle(task.id, event.target.checked)}
              aria-label={`Отметить задачу: ${task.title}`}
            />
            <span>{task.title}</span>
          </label>

          <button
            type="button"
            className="delete-button"
            onClick={() => onDelete(task.id)}
            aria-label={`Удалить задачу: ${task.title}`}
          >
            Удалить
          </button>
        </li>
      ))}
    </ul>
  );
}
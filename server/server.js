import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { randomUUID } from "node:crypto";

dotenv.config();

const app = express();

const configuredOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const allowedOrigins = new Set([
  "http://localhost:5173",
  "https://smart-todolist-frontend.vercel.app",
  ...configuredOrigins,
]);

const corsOptions = {
  origin(origin, callback) {
    const normalizedOrigin = origin?.replace(/\/+$/, "");

    if (!normalizedOrigin || allowedOrigins.has(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-api-key"],
  optionsSuccessStatus: 204,
};

const corsMiddleware = cors(corsOptions);

// Обрабатываем preflight для коллекции задач и отдельных задач.
app.options("/api/tasks", corsMiddleware);
app.options("/api/tasks/:id", corsMiddleware);

app.use(corsMiddleware);
app.use(express.json());

let tasks = [];

function requireApiKey(req, res, next) {
  const expectedKey = process.env.API_KEY;
  const providedKey = req.get("x-api-key");

  if (!expectedKey) {
    return res.status(500).json({
      error: "На сервере не настроен API_KEY",
    });
  }

  if (providedKey !== expectedKey) {
    return res.status(401).json({
      error: "Неверный или отсутствующий API-ключ",
    });
  }

  next();
}

function validateNewTask(req, res, next) {
  const title = req.body?.title;

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      error: "Название задачи обязательно",
    });
  }

  if (title.trim().length > 200) {
    return res.status(400).json({
      error: "Название задачи не должно превышать 200 символов",
    });
  }

  req.validatedTitle = title.trim();
  next();
}

function validateTaskStatus(req, res, next) {
  if (typeof req.body?.completed !== "boolean") {
    return res.status(400).json({
      error: "Поле completed должно быть true или false",
    });
  }

  next();
}

// Получить все задачи
app.get("/api/tasks", requireApiKey, (req, res) => {
  res.json(tasks);
});

// Добавить задачу
app.post("/api/tasks", requireApiKey, validateNewTask, (req, res) => {
  const task = {
    id: randomUUID(),
    title: req.validatedTitle,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.unshift(task);
  res.status(201).json(task);
});

// Изменить статус задачи
app.put("/api/tasks/:id", requireApiKey, validateTaskStatus, (req, res) => {
  const task = tasks.find((item) => item.id === req.params.id);

  if (!task) {
    return res.status(404).json({ error: "Задача не найдена" });
  }

  task.completed = req.body.completed;
  res.json(task);
});

// Удалить задачу
app.delete("/api/tasks/:id", requireApiKey, (req, res) => {
  const index = tasks.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Задача не найдена" });
  }

  const [deletedTask] = tasks.splice(index, 1);
  res.json(deletedTask);
});

// Неизвестный маршрут
app.use((req, res) => {
  res.status(404).json({ error: "Маршрут не найден" });
});

export default app;
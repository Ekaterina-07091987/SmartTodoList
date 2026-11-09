# Smart TodoList — Умный список задач

Учебное клиент-серверное приложение для создания и управления задачами.

## Руководство пользователя

1. Откройте приложение в браузере.
2. Введите название дела и нажмите **Добавить**.
3. Отметьте выполненную задачу чекбоксом.
4. Используйте фильтры **Все**, **Активные** и **Завершённые**.
5. Для удаления задачи нажмите **Удалить**.

## Запуск локально

Нужны Node.js и npm.

### Backend

Создайте `server/.env`:

    PORT=3001
    API_KEY=your-local-api-key
    CLIENT_ORIGIN=http://localhost:5173

В терминале из папки проекта:

    cd server
    npm install
    npm start

### Frontend

Создайте `client/.env`:

    VITE_API_URL=http://localhost:3001
    VITE_API_KEY=your-local-api-key

В другом терминале:

    cd client
    npm install
    npm run dev

Откройте адрес Vite, обычно http://localhost:5173. Ключ `VITE_API_KEY` должен совпадать с `API_KEY` сервера.

## Тесты

Из папки `client` выполните:

    npm test

## API

Для запросов требуется заголовок `x-api-key`.

| Метод | Путь | Действие |
|---|---|---|
| GET | `/api/tasks` | Получить задачи |
| POST | `/api/tasks` | Добавить задачу |
| PUT | `/api/tasks/:id` | Изменить статус |
| DELETE | `/api/tasks/:id` | Удалить задачу |

## Деплой на Vercel

Из одного GitHub-репозитория создаются два проекта:

- Backend: Root Directory — `server`.
- Frontend: Root Directory — `client`.

В настройках backend задайте `API_KEY` и `CLIENT_ORIGIN`.
В настройках frontend задайте `VITE_API_URL` — адрес backend-проекта — и `VITE_API_KEY` с тем же значением, что у `API_KEY`.

После получения адреса frontend укажите его в `CLIENT_ORIGIN` backend-проекта и повторно разверните backend.

## Ограничения

Задачи хранятся в памяти и могут пропасть при перезапуске сервера. Для постоянного хранения нужна база данных.

`VITE_API_KEY` виден в браузере; эта проверка предназначена для учебной демонстрации, а не для настоящей авторизации.
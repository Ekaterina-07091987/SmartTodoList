import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FilterButtons, TaskForm, TaskList } from "./components";

const tasks = [
  { id: "1", title: "Изучить React", completed: false },
  { id: "2", title: "Сдать проект", completed: true },
];

test("показывает список задач", () => {
  render(<TaskList tasks={tasks} onToggle={() => {}} onDelete={() => {}} />);

  expect(screen.getByText("Изучить React")).toBeInTheDocument();
  expect(screen.getByText("Сдать проект")).toBeInTheDocument();
});

test("передаёт изменение статуса задачи", () => {
  const onToggle = jest.fn();

  render(<TaskList tasks={tasks} onToggle={onToggle} onDelete={() => {}} />);
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Отметить задачу: Изучить React" })
  );

  expect(onToggle).toHaveBeenCalledWith("1", true);
});

test("передаёт удаление задачи", () => {
  const onDelete = jest.fn();

  render(<TaskList tasks={tasks} onToggle={() => {}} onDelete={onDelete} />);
  fireEvent.click(
    screen.getByRole("button", { name: "Удалить задачу: Изучить React" })
  );

  expect(onDelete).toHaveBeenCalledWith("1");
});

test("передаёт выбранный фильтр", () => {
  const onChange = jest.fn();

  render(<FilterButtons filter="all" onChange={onChange} />);
  fireEvent.click(screen.getByRole("button", { name: "Активные" }));

  expect(onChange).toHaveBeenCalledWith("active");
});

test("добавляет задачу без лишних пробелов", async () => {
  const onAdd = jest.fn().mockResolvedValue(undefined);

  render(<TaskForm onAdd={onAdd} />);
  fireEvent.change(screen.getByLabelText("Новая задача"), {
    target: { value: "  Подготовить отчёт  " },
  });
  fireEvent.click(screen.getByRole("button", { name: "Добавить" }));

  await waitFor(() => {
  expect(onAdd).toHaveBeenCalledWith("Подготовить отчёт");
  expect(screen.getByLabelText("Новая задача")).toHaveValue("");
});
});
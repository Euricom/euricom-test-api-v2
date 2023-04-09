import type { Task } from "./schema";

let tasks: Task[] = [];
generateTasks();

export function clearTasks() {
  tasks = [];
}

export function generateTasks() {
  tasks = [
    {
      id: 1,
      desc: "Drink coffee",
      completed: true,
    },
    {
      id: 2,
      desc: "Write code",
      completed: false,
    },
    {
      id: 3,
      desc: "Document work",
      completed: false,
    },
  ];
}
export function getAllTasks() {
  return tasks;
}
export function getTask(id: number) {
  return tasks.find((task) => task.id === id);
}
export function deleteTask(task: Task) {
  tasks = tasks.filter((item) => task.id !== item.id);
  return task;
}
export function addTask(task: Task) {
  tasks.push(task);
  return task;
}

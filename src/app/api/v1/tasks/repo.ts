import type { Task } from "./schema";

let tasks: Task[];

function ensureWeHaveTasks() {
  if (!tasks) {
    tasks = generateTasks(3);
  }
}

export function clearTasks() {
  tasks = [];
}

export function generateTasks(count = 3) {
  tasks = [];
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
  console.log("generated tasks", count);
  return tasks;
}
export function getAllTasks() {
  ensureWeHaveTasks();
  return tasks;
}
export function getTask(id: number) {
  ensureWeHaveTasks();
  return tasks.find((task) => task.id === id);
}
export function deleteTask(task: Task) {
  ensureWeHaveTasks();
  tasks = tasks.filter((item) => task.id !== item.id);
  return task;
}
export function addTask(task: Task) {
  ensureWeHaveTasks();
  tasks.push(task);
  return task;
}

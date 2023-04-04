import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
});

type User = z.infer<typeof userSchema>;

let users: User[] = [];
seedUsers();

export function clearTasks() {
  users = [];
}

export function seedUsers() {
  users = [
    {
      id: 1,
      name: "Peter",
    },
  ];
}
export function getAllTasks() {
  return users;
}
export function getTask(id: number) {
  return users.find((task) => task.id === id);
}
export function deleteTask(user: User) {
  users = users.filter((item) => user.id !== item.id);
  return user;
}
export function addTask(user: User) {
  users.push(user);
  return user;
}

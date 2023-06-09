import { faker } from "@faker-js/faker";
import { type User } from "./schema";

let users: User[];

function ensureWeHaveUsers() {
  console.log("ensureWeHaveUsers", users?.length);
  if (users === undefined) {
    users = generateUsers(100);
  }
}

export function generateUsers(count: number) {
  users = [];
  for (let i = 0; i < count; i++) {
    // eslint-disable-line
    const lastName = faker.name.lastName();
    const firstName = faker.name.firstName();
    const imageUrl = faker.image.avatar();
    // imageUrl = `https://api.adorable.io/avatars/400/${firstName}-${lastName}`;
    users.push({
      id: 1000 + i,
      firstName,
      lastName,
      age: faker.datatype.number({ min: 18, max: 65 }),
      email:
        `${firstName}.${lastName}@${faker.internet.domainName()}`.toLowerCase(),
      image: imageUrl,
      phone: faker.phone.number(),
      company: faker.company.name(),
      createdAt: faker.date.past(),
      address: {
        street: faker.address.street(),
        city: faker.address.city(),
        zip: faker.address.zipCode(),
      },
    });
  }
  console.log("generated users", count);
  return users;
}

export function getAllUsers() {
  ensureWeHaveUsers();
  return users;
}
export function getUser(id: number) {
  ensureWeHaveUsers();
  return users.find((user) => user.id === id);
}
export function deleteUser(user: User) {
  ensureWeHaveUsers();
  users = users.filter((item) => user.id !== item.id);
  return user;
}
export function addUser(user: User) {
  ensureWeHaveUsers();
  users.push(user);
  return user;
}

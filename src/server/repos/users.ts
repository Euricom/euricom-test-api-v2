import { faker } from "@faker-js/faker";
import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  age: z.number().min(18).max(80),
  email: z.string().email(),
  image: z.string(),
  phone: z.string(),
  company: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    zip: z.string(),
  }),
});

type User = z.infer<typeof userSchema> & {
  id: number;
};

let users: User[] = generateUsers(100);

function generateUsers(count: number) {
  const users = [];
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
      address: {
        street: faker.address.street(),
        city: faker.address.city(),
        zip: faker.address.zipCode(),
      },
    });
  }
  return users;
}

export function getAllUsers() {
  return users;
}
export function getUser(id: number) {
  return users.find((user) => user.id === id);
}
export function deleteUser(user: User) {
  users = users.filter((item) => user.id !== item.id);
  return user;
}
export function addUser(user: User) {
  users.push(user);
  return user;
}

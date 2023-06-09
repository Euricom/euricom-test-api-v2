import { faker } from "@faker-js/faker";
import type { Product } from "./schema";

let products: Product[];

function ensureWeHaveProducts() {
  if (!products) {
    products = generateProducts(100);
  }
}

export function clear() {
  products = [];
}

export function generateProducts(count: number): Product[] {
  products = [];
  for (let i = 0; i < count; i++) {
    // imageUrl = `https://api.adorable.io/avatars/400/${firstName}-${lastName}`;
    const product = {
      id: 1000 + i,
      sku: faker.random.alphaNumeric(10),
      title: faker.commerce.productName(),
      stocked: faker.datatype.boolean(),
      price: faker.datatype.number({ min: 100, max: 1000 }),
      basePrice: 0,
      desc: faker.commerce.productDescription(),
      image: faker.image.technics(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    };
    product.basePrice = product.price - (product.price / 100) * 20;
    product.updatedAt = product.createdAt;
    products.push(product);
  }
  console.log("generated products", count);
  return products;
}

export function getAll() {
  ensureWeHaveProducts();
  return products;
}
export function getById(id: number) {
  ensureWeHaveProducts();
  return products.find((product) => product.id === id);
}
export function deleteItem(product: Product) {
  ensureWeHaveProducts();
  products = products.filter((item) => product.id !== item.id);
  return product;
}
export function add(product: Product) {
  ensureWeHaveProducts();
  products.push(product);
  return product;
}

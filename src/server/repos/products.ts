import { z } from "zod";

export const productSchema = z.object({
  id: z.number(),
  sku: z.string(),
  title: z.string(),
  stocked: z.boolean(),
  price: z.number(),
  desc: z.string().optional(),
  image: z.string().optional(),
  basePrice: z.number().optional(),
});

type Product = z.infer<typeof productSchema>;

let products: Product[] = [];
seed();

export function clear() {
  products = [];
}

export function seed() {
  products = [
    {
      id: 1,
      sku: "sku-1",
      title: "iPhone",
      stocked: true,
      price: 1000,
    },
  ];
}

export function getAll() {
  return products;
}
export function getById(id: number) {
  return products.find((product) => product.id === id);
}
export function deleteItem(product: Product) {
  products = products.filter((item) => product.id !== item.id);
  return product;
}
export function add(product: Product) {
  products.push(product);
  return product;
}

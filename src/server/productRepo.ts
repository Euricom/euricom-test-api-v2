import { z } from "zod";

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
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
      name: "iPhone",
    },
  ];
}

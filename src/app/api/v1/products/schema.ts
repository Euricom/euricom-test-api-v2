import { z, swaggerComponent } from "@/server/swagger";

export const ProductSchema = swaggerComponent(
  "product",
  z.object({
    id: z.number(),
    sku: z.string(),
    title: z.string(),
    stocked: z.boolean(),
    price: z.number(),
    desc: z.string().optional(),
    image: z.string().optional(),
    basePrice: z.number().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
);

export type Product = z.infer<typeof ProductSchema>;

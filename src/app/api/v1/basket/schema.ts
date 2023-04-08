import { z, swaggerComponent } from "@/server/swagger";

export const BasketItemSchema = z.object({
  id: z.number(),
  productId: z.number(),
  quantity: z.number(),
});

export const BasketSchema = swaggerComponent(
  "basket",
  z.array(BasketItemSchema)
);

export type Basket = z.infer<typeof BasketSchema>;

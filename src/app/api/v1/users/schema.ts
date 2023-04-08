import { swaggerComponent } from "@/server/swagger";
import { z } from "zod";

export const UserSchema = swaggerComponent(
  "user",
  z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    age: z.number().min(18).max(80),
    email: z.string().email(),
    image: z.string(),
    phone: z.string(),
    company: z.string(),
    createdAt: z.date(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      zip: z.string(),
    }),
  })
);

export type User = z.infer<typeof UserSchema>;

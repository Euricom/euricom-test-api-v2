import { swaggerComponent } from "@/server/swagger";
import { z } from "zod";

export const taskSchema = swaggerComponent(
  "task",
  z.object({
    id: z.number(),
    desc: z.string().describe("Description of the task"),
    completed: z.boolean().describe("is task completed?"),
  })
);

export type Task = z.infer<typeof taskSchema>;

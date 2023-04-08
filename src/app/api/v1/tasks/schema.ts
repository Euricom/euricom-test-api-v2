import { z, swaggerComponent } from "@/server/swagger";

export const taskSchema = swaggerComponent(
  "task",
  z.object({
    id: z.number(),
    desc: z.string().describe("Description of the task"),
    completed: z.boolean().describe("is task completed?"),
  })
);

export type Task = z.infer<typeof taskSchema>;

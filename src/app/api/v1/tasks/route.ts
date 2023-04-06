import { badRequest, ok } from "@/server/httpUtils";
import { addTask, getAllTasks } from "@/server/repos/tasks";
import { z } from "zod";

const taskPostSchema = z
  .object({
    desc: z.string(),
    completed: z
      .boolean()
      .optional()
      .transform((val) => !!val),
  })
  .strict();

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     description: Gets all tasks
 *     tags: [tasks]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *            schema:
 *             $ref: '#/components/schemas/task'
 */
export function GET() {
  const tasks = getAllTasks();

  return ok(tasks);
}

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   post:
 *     description: Create a task
 *     tags: [tasks]
 *     consumes:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/task'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *            schema:
 *             $ref: '#/components/schemas/task'
 *       404:
 *         description: NOT_FOUND
 */
export function POST(request: Request) {
  const result = taskPostSchema.safeParse(request.body);
  if (!result.success) {
    return badRequest({
      message: "Invalid task",
      errors: result.error.format(),
    });
  }

  const newTask = addTask({
    ...result.data,
    id: new Date().valueOf(),
  });
  return ok(newTask);
}

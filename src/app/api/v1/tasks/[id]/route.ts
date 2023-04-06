import { badRequest, noContent, notFound, ok } from "@/server/httpUtils";
import { deleteTask, getTask } from "@/server/repos/tasks";
import { z } from "zod";

type Context = {
  params: {
    id: string;
  };
};

const taskPutSchema = z
  .object({
    desc: z.string().optional(),
    completed: z.boolean().optional(),
  })
  .strict();

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     description: Updates a task
 *     tags: [tasks]
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       type: "integer"
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
 *       400:
 *         description: BAD_REQUEST
 */
export async function PUT(request: Request, { params }: Context) {
  const task = getTask(Number(params.id));
  if (!task) {
    return notFound(`Task with id ${params.id} not found`);
  }

  const json = await request.json();
  const result = taskPutSchema.safeParse(json);
  if (!result.success) {
    return badRequest({
      message: "Invalid task",
      errors: result.error.format(),
    });
  }

  task.desc = result.data.desc ? result.data.desc : task.desc;
  task.completed =
    result.data.completed !== undefined
      ? result.data.completed
      : task.completed;
  return ok(task);
}

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     description: Removes a task
 *     tags: [tasks]
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       type: "integer"
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *            schema:
 *             $ref: '#/components/schemas/task'
 *       204:
 *         description: NO_CONTENT
 */
export function DELETE(request: Request, { params }: Context) {
  const task = getTask(Number(params.id));
  if (!task) {
    return noContent();
  }

  const deletedTask = deleteTask(task);
  return ok(deletedTask);
}

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     description: Gets a task
 *     tags: [tasks]
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       type: "integer"
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
export function GET(request: Request, { params }: Context) {
  const task = getTask(Number(params.id));
  if (!task) {
    return notFound(`Task with id ${params.id} not found`);
  }

  return ok(task);
}

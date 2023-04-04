import { deleteTask, getTask } from "@/server/taskRepo";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export const taskPutSchema = z
  .object({
    desc: z.string().optional(),
    completed: z.boolean().optional(),
  })
  .strict();

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query as { id: string };

  const task = getTask(Number(id));

  /**
   * @swagger
   * /api/v1/products/{id}:
   *   delete:
   *     description: Removes a task
   *     tags: [products]
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
  if (req.method === "DELETE") {
    if (!task) {
      return res.status(204).send(null);
    }

    const deletedTask = deleteTask(task);
    return res.status(200).json(deletedTask);
  }

  if (!task) {
    return res.status(404).json({
      error: "NotFound",
      message: `Task with id ${id} not found`,
    });
  }

  /**
   * @swagger
   * /api/v1/products/{id}:
   *   get:
   *     description: Removes a task
   *     tags: [products]
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
  if (req.method === "GET") {
    res.status(200).json(task);
  }

  /**
   * @swagger
   * /api/v1/products/{id}:
   *   put:
   *     description: Updates a task
   *     tags: [products]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: user
   *         description: The user to create.
   *         schema:
   *           type: object
   *           properties:
   *             desc:
   *               type: string
   *             completed:
   *               type: boolean
   *               default: false
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
  if (req.method === "PUT") {
    const result = taskPutSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: "BadRequest",
        message: "Invalid task",
        details: result.error.format(),
      });
      return;
    }

    task.desc = result.data.desc ? result.data.desc : task.desc;
    task.completed =
      result.data.completed !== undefined
        ? result.data.completed
        : task.completed;
    return res.status(200).json(task);
  }
};

export default handler;

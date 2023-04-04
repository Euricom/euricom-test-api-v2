import { addTask, getAllTasks } from "@/server/taskRepo";
import type { NextApiRequest, NextApiResponse } from "next";
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

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * @swagger
   * /api/v1/products:
   *   get:
   *     description: Gets all tasks
   *     tags: [products]
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *            schema:
   *             $ref: '#/components/schemas/task'
   */
  if (req.method === "GET") {
    const tasks = getAllTasks();
    res.status(200).json(tasks);
    return;
  }

  /**
   * @swagger
   * /api/v1/products/{id}:
   *   post:
   *     description: Create a task
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
   *         content:
   *           application/json:
   *            schema:
   *             $ref: '#/components/schemas/error'
   */
  if (req.method === "POST") {
    const result = taskPostSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "BadRequest",
        message: "Invalid task",
        details: result.error.format(),
      });
    }
    const task = {
      ...result.data,
      id: new Date().valueOf(),
    };
    addTask(task);
    res.status(201).json(task);
  }

  res.status(405).json({
    error: "MethodNotAllowed",
    message: `Method ${req.method || "UNKNOWN"} not allowed`,
  });
};

export default handler;
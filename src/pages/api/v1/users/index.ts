/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { addUser, getAllUsers, userSchema } from "@/server/userRepo";
import type { NextApiRequest, NextApiResponse } from "next";
import sortOn from "sort-on";
import { chain } from "lodash";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * @swagger
   * /api/v1/users:
   *   get:
   *     description: Gets all users
   *     tags: [users]
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *            schema:
   *             $ref: '#/components/schemas/user'
   */
  if (req.method === "GET") {
    const page = Number(req.query.page || 0);
    const pageSize = Number(req.query.pageSize || 20);
    const sortBy = req.query.sort || "";
    console.log("page:", page);
    console.log("pageSize:", pageSize);
    console.log("sortBy:", sortBy);

    let entities = getAllUsers();
    if (sortBy) {
      entities = sortOn(entities, sortBy);
    }
    const subset = chain(entities)
      .drop(page * pageSize)
      .take(pageSize)
      .value();

    res.status(200).json({
      items: subset,
      total: entities.length,
      page,
      pageSize,
    });
    return;
  }

  /**
   * @swagger
   * /api/v1/users:
   *   post:
   *     description: Create a user
   *     tags: [users]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: user
   *         description: The user to create.
   *         schema:
   *           $ref: '#/components/schemas/user'
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *            schema:
   *             $ref: '#/components/schemas/user'
   *       404:
   *         description: NOT_FOUND
   *         content:
   *           application/json:
   *            schema:
   *             $ref: '#/components/schemas/error'
   */
  if (req.method === "POST") {
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "BadRequest",
        message: "Invalid task",
        details: result.error.format(),
      });
    }
    const user = {
      ...result.data,
      id: new Date().valueOf(),
    };
    addUser(user);
    res.status(201).json(user);
  }

  res.status(405).json({
    error: "MethodNotAllowed",
    message: `Method ${req.method || "UNKNOWN"} not allowed`,
  });
};

export default handler;

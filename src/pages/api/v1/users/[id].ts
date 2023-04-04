import { deleteUser, getUser, userSchema } from "@/server/userRepo";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export const userPutSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  age: z.number().min(18).max(80).optional(),
  email: z.string().email().optional(),
  image: z.string().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      zip: z.string().optional(),
    })
    .optional(),
});

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query as { id: string };

  const user = getUser(Number(id));

  /**
   * @swagger
   * /api/v1/users/{id}:
   *   delete:
   *     description: Removes a user
   *     tags: [users]
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *            schema:
   *             $ref: '#/components/schemas/user'
   *       204:
   *         description: NO_CONTENT
   */
  if (req.method === "DELETE") {
    if (!user) {
      return res.status(204).send(null);
    }

    const deletedUser = deleteUser(user);
    return res.status(200).json(deletedUser);
  }

  if (!user) {
    return res.status(404).json({
      error: "NotFound",
      message: `User with id ${id} not found`,
    });
  }

  /**
   * @swagger
   * /api/v1/users/{id}:
   *   get:
   *     description: Get a single user by id
   *     tags: [users]
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
  if (req.method === "GET") {
    res.status(200).json(user);
  }

  /**
   * @swagger
   * /api/v1/users/{id}:
   *   put:
   *     description: Updates a User
   *     tags: [users]
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
   *             $ref: '#/components/schemas/user'
   *       404:
   *         description: NOT_FOUND
   *         content:
   *           application/json:
   *            schema:
   *             $ref: '#/components/schemas/error'
   *       400:
   *         description: BAD_REQUEST
   *         summary: Invalid user
   *         content:
   *           application/json:
   *            schema:
   *             $ref: '#/components/schemas/error'
   */
  if (req.method === "PUT") {
    const result = userPutSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: "BadRequest",
        message: "Invalid user",
        details: result.error.format(),
      });
      return;
    }

    user.firstName = result.data.firstName
      ? result.data.firstName
      : user.firstName;
    user.lastName = result.data.lastName ? result.data.lastName : user.lastName;
    user.email = result.data.email ? result.data.email : user.email;
    user.age = result.data.age ? result.data.age : user.age;
    user.image = result.data.image ? result.data.image : user.image;
    user.phone = result.data.phone ? result.data.phone : user.phone;
    user.company = result.data.company ? result.data.company : user.company;
    if (result.data.address) {
      user.address.street = result.data.address.street
        ? result.data.address.street
        : user.address.street;
      user.address.city = result.data.address.city
        ? result.data.address.city
        : user.address.city;
      user.address.zip = result.data.address.zip
        ? result.data.address.zip
        : user.address.zip;
    }
    return res.status(200).json(user);
  }
};

export default handler;

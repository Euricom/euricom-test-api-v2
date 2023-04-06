import { badRequest, noContent, notFound, ok } from "@/server/httpUtils";
import { deleteUser, getUser } from "@/server/repos/users";
import { z } from "zod";

type Context = {
  params: {
    id: string;
  };
};

export const userPutSchema = z
  .object({
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
  })
  .strict();

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     description: Updates a User
 *     tags: [users]
 *     consumes:
 *       - application/json
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       type: "integer"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/user'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *            schema:
 *             $ref: '#/components/schemas/user'
 *       404:
 *         description: NOT_FOUND
 *       400:
 *         description: BAD_REQUEST
 */
export async function PUT(request: Request, { params }: Context) {
  const user = getUser(Number(params.id));
  if (!user) {
    return notFound(`User with id ${params.id} not found`);
  }

  const json = await request.json();
  const result = userPutSchema.safeParse(json);
  if (!result.success) {
    return badRequest({
      message: "Invalid User",
      details: result.error.format(),
    });
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
  return ok(user);
}

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     description: Removes a user
 *     tags: [users]
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
 *             $ref: '#/components/schemas/user'
 *       204:
 *         description: NO_CONTENT
 */
export function DELETE(request: Request, { params }: Context) {
  const user = getUser(Number(params.id));
  if (!user) {
    return noContent();
  }

  const deletedUser = deleteUser(user);
  return ok(deletedUser);
}

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     description: Get a single user by id
 *     tags: [users]
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
 *             $ref: '#/components/schemas/user'
 *       404:
 *         description: NOT_FOUND
 */
export function GET(request: Request, { params }: Context) {
  const user = getUser(Number(params.id));
  if (!user) {
    return notFound(`User with id ${params.id} not found`);
  }

  return ok(user);
}

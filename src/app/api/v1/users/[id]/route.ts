import { noContent, notFound, ok, withErrorHandling } from "@/server/httpUtils";
import { deleteUser, getUser } from "../repo";
import { UserSchema } from "../schema";
import { z, swaggerComponent, swaggerPath } from "@/server/swagger";

type Context = {
  params: {
    id: string;
  };
};

//
// PUT /api/v1/users/{id}
// Update a user
//

const UserSchemaUpdate = swaggerComponent(
  "userUpdate",
  UserSchema.omit({ id: true, createdAt: true }).partial()
);
swaggerPath({
  method: "put",
  path: "/api/v1/users/{id}",
  tags: ["users"],
  request: {
    params: z.object({ id: z.number() }),
    body: {
      content: {
        "application/json": {
          schema: UserSchemaUpdate,
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
    },
    400: {
      description: "BAD_REQUEST",
    },
    404: {
      description: "NOT_FOUND",
    },
  },
});

export async function PUT(request: Request, { params }: Context) {
  const handler = async () => {
    const user = getUser(Number(params.id));
    if (!user) {
      return notFound(`User with id ${params.id} not found`);
    }

    const body = await request.json();
    const data = UserSchemaUpdate.parse(body);

    user.firstName = data.firstName ? data.firstName : user.firstName;
    user.lastName = data.lastName ? data.lastName : user.lastName;
    user.email = data.email ? data.email : user.email;
    user.age = data.age ? data.age : user.age;
    user.image = data.image ? data.image : user.image;
    user.phone = data.phone ? data.phone : user.phone;
    user.company = data.company ? data.company : user.company;
    if (data.address) {
      user.address.street = data.address.street
        ? data.address.street
        : user.address.street;
      user.address.city = data.address.city
        ? data.address.city
        : user.address.city;
      user.address.zip = data.address.zip ? data.address.zip : user.address.zip;
    }
    return ok(user);
  };
  return withErrorHandling(handler);
}

//
// DELETE /api/v1/users/{id}
// Delete a user
//

swaggerPath({
  method: "delete",
  path: "/api/v1/users/{id}",
  tags: ["users"],
  request: {
    params: z.object({ id: z.number() }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
    },
    201: {
      description: "NO_CONTENT",
    },
  },
});

export function DELETE(request: Request, { params }: Context) {
  const handler = () => {
    const user = getUser(Number(params.id));
    if (!user) {
      return noContent();
    }

    const deletedUser = deleteUser(user);
    return ok(deletedUser);
  };
  return withErrorHandling(handler);
}

//
// GET /api/v1/users/{id}
// Get a user by id
//

swaggerPath({
  method: "get",
  path: "/api/v1/users/{id}",
  tags: ["users"],
  request: {
    params: z.object({ id: z.number() }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
    },
    404: {
      description: "NO_FOUND",
    },
  },
});

export function GET(request: Request, { params }: Context) {
  const handler = () => {
    const user = getUser(Number(params.id));
    if (!user) {
      return notFound(`User with id ${params.id} not found`);
    }

    return ok(user);
  };
  return withErrorHandling(handler);
}

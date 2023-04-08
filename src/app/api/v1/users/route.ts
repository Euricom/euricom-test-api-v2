import sortOn from "sort-on";
import { chain } from "lodash";
import { ok, withErrorHandling } from "@/server/httpUtils";
import { getSearchParams } from "@/server/requestUtils";
import { swaggerComponent, swaggerPath, z } from "@/server/swagger";
import { UserSchema } from "./schema";
import { addUser, getAllUsers } from "./repo";

//
// GET /api/v1/tasks
//

const ParamsSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  sortBy: z.string().optional(),
});

const UserListSchema = swaggerComponent(
  "userList",
  z.object({
    items: z.array(UserSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
  })
);

// Swagger
swaggerPath({
  method: "get",
  path: "/api/v1/users",
  tags: ["users"],
  request: {
    query: ParamsSchema,
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: UserListSchema,
        },
      },
    },
  },
});
export function GET(request: Request) {
  const {
    page = 0,
    pageSize = 20,
    sortBy = "",
  } = getSearchParams(request, ParamsSchema);
  console.log(`getUsers: page=${page}, pageSize=${pageSize}, sortBy=${sortBy}`);

  let entities = getAllUsers();
  if (sortBy) {
    entities = sortOn(entities, sortBy);
  }
  const subset = chain(entities)
    .drop(page * pageSize)
    .take(pageSize)
    .value();

  return ok({
    page,
    pageSize,
    total: entities.length,
    items: subset,
  });
}

//
// POST /api/v1/users
// Create a new user
//

const UserSchemaCreate = swaggerComponent(
  "userCreate",
  UserSchema.omit({ id: true, createdAt: true })
);

swaggerPath({
  method: "post",
  path: "/api/v1/users",
  tags: ["users"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: UserSchemaCreate,
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
  },
});

export function POST(request: Request) {
  const handler = async () => {
    const body = await request.json();
    const data = UserSchemaCreate.parse(body);

    const user = {
      ...data,
      id: new Date().valueOf(),
      createdAt: new Date(),
    };
    addUser(user);
    return ok(user);
  };

  return withErrorHandling(handler);
}

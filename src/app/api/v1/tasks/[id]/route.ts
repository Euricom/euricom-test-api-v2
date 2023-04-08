import {
  NotFoundError,
  noContent,
  notFound,
  ok,
  withErrorHandling,
} from "@/server/httpUtils";
import { deleteTask, getTask } from "../repo";
import { taskSchema } from "../schema";
import { swaggerComponent, swaggerPath, z } from "@/server/swagger";

type Context = {
  params: {
    id: string;
  };
};

//
// PUT /api/v1/tasks/{id}
//

const taskSchemaUpdate = swaggerComponent(
  "taskUpdate",
  taskSchema.omit({ id: true }).partial()
);
swaggerPath({
  method: "put",
  path: "/api/v1/tasks/{id}",
  tags: ["tasks"],
  request: {
    params: z.object({ id: z.number() }),
    body: {
      content: {
        "application/json": {
          schema: taskSchemaUpdate,
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: taskSchema,
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
export function PUT(request: Request, { params }: Context) {
  const handler = async () => {
    const task = getTask(Number(params.id));
    if (!task) {
      throw new NotFoundError(`Task with id ${params.id} not found`);
    }

    const json = await request.json();
    const data = taskSchemaUpdate.partial().parse(json);
    task.desc = data.desc ? data.desc : task.desc;
    task.completed =
      data.completed !== undefined ? data.completed : task.completed;
    return ok(task);
  };
  return withErrorHandling(handler);
}

//
// DELETE /api/v1/tasks/{id}
//
swaggerPath({
  method: "delete",
  path: "/api/v1/tasks/{id}",
  tags: ["tasks"],
  request: {
    params: z.object({ id: z.number() }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: taskSchema,
        },
      },
    },
    404: {
      description: "NOT_FOUND",
    },
  },
});
export function DELETE(request: Request, { params }: Context) {
  const task = getTask(Number(params.id));
  if (!task) {
    return noContent();
  }

  const deletedTask = deleteTask(task);
  return ok(deletedTask);
}

//
// GET /api/v1/tasks/{id}
//

swaggerPath({
  method: "get",
  path: "/api/v1/tasks/{id}",
  tags: ["tasks"],
  request: {
    params: z.object({ id: z.number() }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: taskSchema,
        },
      },
    },
    404: {
      description: "NOT_FOUND",
    },
  },
});
export function GET(request: Request, { params }: Context) {
  const task = getTask(Number(params.id));
  if (!task) {
    return notFound(`Task with id ${params.id} not found`);
  }

  return ok(task);
}

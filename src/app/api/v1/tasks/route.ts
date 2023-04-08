import { ok, withErrorHandling } from "@/server/httpUtils";
import { addTask, getAllTasks } from "./repo";
import { swaggerComponent, swaggerPath } from "@/server/swagger";
import { taskSchema } from "./schema";

//
// GET /api/v1/tasks
//

// Swagger
swaggerPath({
  method: "get",
  path: "/api/v1/tasks",
  tags: ["tasks"],
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: taskSchema,
        },
      },
    },
  },
});

export function GET() {
  const tasks = getAllTasks();
  return ok(tasks);
}

//
// POST /api/v1/tasks
//

const taskSchemaCreate = swaggerComponent(
  "taskCreate",
  taskSchema.omit({ id: true })
);

swaggerPath({
  method: "post",
  path: "/api/v1/tasks",
  tags: ["tasks"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: taskSchemaCreate,
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
  },
});

export function POST(request: Request) {
  const handler = async () => {
    const json = await request.json();
    const body = taskSchemaCreate.parse(json);
    const newTask = addTask({
      ...body,
      id: new Date().valueOf(),
    });
    return ok(newTask);
  };

  return withErrorHandling(handler);
}

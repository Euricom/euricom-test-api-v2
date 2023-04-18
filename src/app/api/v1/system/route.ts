import { ok } from "@/server/httpUtils";
import { generateProducts } from "../products/repo";
import { generateUsers } from "../users/repo";
import { generateTasks } from "../tasks/repo";
import { z } from "zod";
import { getSearchParams } from "@/server/requestUtils";
import { swaggerPath } from "@/server/swagger";

const ParamsSchema = z.object({
  users: z.coerce.number().optional(),
  products: z.coerce.number().optional(),
  tasks: z.coerce.number().optional(),
});

// Swagger
swaggerPath({
  method: "delete",
  path: "/api/v1/system",
  tags: ["system"],
  request: {
    query: ParamsSchema,
  },
  responses: {
    200: {
      description: "OK",
    },
  },
});

export function DELETE(request: Request) {
  const {
    users = 100,
    products = 100,
    tasks = 3,
  } = getSearchParams(request, ParamsSchema);

  console.log({ users, products, tasks });

  generateProducts(products);
  generateUsers(users);
  generateTasks(tasks);

  return ok({ message: "Tasks, Product and User are (re)generated." });
}

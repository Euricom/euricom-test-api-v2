import { withSwagger } from "next-swagger-doc";
import { generateSchema } from "@anatine/zod-openapi";
import { taskSchema } from "@/server/taskRepo";
import { userSchema } from "@/server/userRepo";
import { productSchema } from "@/server/productRepo";
import pkg from "../../../../package.json";

const swaggerHandler = withSwagger({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Euricom Test API - V2",
      version: pkg.version,
    },
    components: {
      schemas: {
        task: generateSchema(taskSchema),
        user: generateSchema(userSchema),
        product: generateSchema(productSchema),
        basket: generateSchema(productSchema),
        error: {
          type: "object",
          properties: {
            error: {
              type: "string",
            },
            message: {
              type: "string",
            },
            details: {
              required: false,
              type: "string",
            },
          },
        },
      },
    },
  },
  apiFolder: "src/pages/api",
});
export default swaggerHandler();

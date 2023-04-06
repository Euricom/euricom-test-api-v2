import { withSwagger } from "next-swagger-doc";
import { generateSchema } from "@anatine/zod-openapi";
import { taskSchema } from "@/server/repos/tasks";
import { userSchema } from "@/server/repos/users";
import { productSchema } from "@/server/repos/products";
import { basketSchema } from "@/server/repos/basket";
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
        basket: generateSchema(basketSchema),
      },
    },
  },
  apiFolder: "src/pages/api",
});
export default swaggerHandler();

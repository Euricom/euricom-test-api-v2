import { withSwagger } from "next-swagger-doc";
import pkg from "../../../../package.json";

const swaggerHandler = withSwagger({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Euricom Test API - V2",
      version: pkg.version,
    },
  },
  apiFolder: "src/app/api",
});
export default swaggerHandler();

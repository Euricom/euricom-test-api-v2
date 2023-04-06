import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { createSwaggerSpec } from "next-swagger-doc";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import pkg from "../../package.json";
import { generateSchema } from "@anatine/zod-openapi";
import { taskSchema } from "@/server/repos/tasks";
import { userSchema } from "@/server/repos/users";
import { productSchema } from "@/server/repos/products";
import { basketSchema } from "@/server/repos/basket";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
});

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <SwaggerUI spec={spec} />;
}

export const getStaticProps: GetStaticProps = () => {
  const spec: Record<string, any> = createSwaggerSpec({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Euricom Test API - V2",
        version: pkg.version,
        description: `
<a href="/api/v1/api.swagger.json">/api/v1/api.swagger.json</a>
        `,
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
    apiFolder: "src/app/api",
  });

  return {
    props: {
      spec,
    },
  };
};

export default ApiDoc;

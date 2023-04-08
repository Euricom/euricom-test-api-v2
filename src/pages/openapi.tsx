import type { GetStaticProps, InferGetStaticPropsType } from "next";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import swaggerConfig from "../app/api/v1/swagger.json/config";

import { createSwaggerSpec } from "@/server/swagger";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
});

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <SwaggerUI spec={spec} />;
}

export const getStaticProps: GetStaticProps = () => {
  const spec = createSwaggerSpec(swaggerConfig);
  return {
    props: {
      spec,
    },
  };
};

export default ApiDoc;

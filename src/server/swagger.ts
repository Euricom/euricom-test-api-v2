/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ZodSchema, z } from "zod";
import {
  type RouteConfig,
  OpenAPIRegistry,
  extendZodWithOpenApi,
  OpenAPIGenerator,
} from "@asteasolutions/zod-to-openapi";
import { type OpenAPIObject } from "openapi3-ts";

interface NodeRequire {
  context(
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp
  ): {
    keys(): string[];
    <T>(id: string): T;
  };
}

declare const require: NodeRequire;

export const registry = new OpenAPIRegistry();

export function swaggerComponent<T extends ZodSchema<any>>(
  refId: string,
  zodSchema: T
): T {
  return registry.register(refId, zodSchema);
}

type Method =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "head"
  | "options"
  | "trace";

type OpenAPIObjectConfig = Omit<
  OpenAPIObject,
  "paths" | "components" | "webhooks" | "openapi"
>;

export function swaggerPath(route: RouteConfig) {
  registry.registerPath(route);
}

export const createSwaggerSpec = (config: OpenAPIObjectConfig) => {
  // load all modules
  const req = require.context("..", true, /(route|swagger)$/);
  let registry: any = null;
  req.keys().forEach(function (key) {
    // due to an unknown issue is the registry different between direct
    // import (ESM) and using `require.context`, therefore we
    // get the registry is from the exported registry in this file
    console.log("key", key);
    const theModule: any = req(key);
    if (theModule.registry) {
      registry = theModule.registry;
    }
  });

  // generate the OpenAPI document
  if (registry) {
    const generator = new OpenAPIGenerator(registry.definitions, "3.0.0");
    return generator.generateDocument(config);
  }

  // when registry is not found, just return the base config
  return config;
};

extendZodWithOpenApi(z);
export { z };

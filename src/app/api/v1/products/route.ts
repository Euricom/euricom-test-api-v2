import { ok, withErrorHandling } from "@/server/httpUtils";
import { add, getAll } from "./repo";
import sortOn from "sort-on";
import _ from "lodash";
import { swaggerComponent, swaggerPath, z } from "@/server/swagger";
import { ProductSchema } from "./schema";
import { getSearchParams } from "@/server/requestUtils";

//
// GET /api/v1/products
//

const ParamsSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  sortBy: z.string().optional(),
  filter: z.string().optional(),
});

const ProductListSchema = swaggerComponent(
  "productList",
  z.object({
    items: z.array(ProductSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
  })
);

// Swagger
swaggerPath({
  method: "get",
  path: "/api/v1/products",
  tags: ["products"],
  request: {
    query: ParamsSchema,
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: ProductListSchema,
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
    filter = "",
  } = getSearchParams(request, ParamsSchema);
  console.log(
    `getProducts: page=${page}, pageSize=${pageSize}, sortBy=${sortBy}`
  );

  let entities = getAll();
  if (sortBy) {
    entities = sortOn(entities, sortBy);
  }
  const subset = _.chain(entities)
    .drop(page * pageSize)
    .take(pageSize)
    .filter((item) => item.title.toLowerCase().includes(filter.toLowerCase()))
    .value();

  return ok({
    page,
    pageSize,
    total: entities.length,
    items: subset,
  });
}

//
// POST /api/v1/products
// Create a new product
//

const ProductSchemaCreate = swaggerComponent(
  "productCreate",
  ProductSchema.omit({ id: true, createdAt: true, updatedAt: true })
);

swaggerPath({
  method: "post",
  path: "/api/v1/products",
  tags: ["products"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: ProductSchemaCreate,
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: ProductSchema,
        },
      },
    },
    400: {
      description: "BAD_REQUEST",
    },
  },
});

export function POST(request: Request) {
  console.log(">>>>>>>>");
  const handler = async () => {
    const body = await request.json();
    const data = ProductSchemaCreate.parse(body);

    const product = {
      ...data,
      id: new Date().valueOf(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    add(product);
    return ok(product);
  };

  return withErrorHandling(handler);
}

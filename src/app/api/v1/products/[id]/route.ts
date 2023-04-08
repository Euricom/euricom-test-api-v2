import {
  NotFoundError,
  noContent,
  notFound,
  ok,
  withErrorHandling,
} from "@/server/httpUtils";
import { deleteItem, getById } from "../repo";
import { ProductSchema } from "../schema";
import { z, swaggerComponent, swaggerPath } from "@/server/swagger";

type Context = {
  params: {
    id: string;
  };
};

//
// PUT /api/v1/products/{id}
// Update a user
//

const ProductSchemaUpdate = swaggerComponent(
  "productUpdate",
  ProductSchema.omit({ id: true, createdAt: true }).partial()
);
swaggerPath({
  method: "put",
  path: "/api/v1/products/{id}",
  tags: ["products"],
  request: {
    params: z.object({ id: z.number() }),
    body: {
      content: {
        "application/json": {
          schema: ProductSchemaUpdate,
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
    404: {
      description: "NOT_FOUND",
    },
  },
});

export async function PUT(request: Request, { params }: Context) {
  const handler = async () => {
    const product = getById(Number(params.id));
    if (!product) {
      throw new NotFoundError(`User with id ${params.id} not found`);
    }

    const body = await request.json();
    const data = ProductSchemaUpdate.parse(body);

    product.basePrice = data.basePrice ? data.basePrice : product.basePrice;
    product.desc = data.desc ? data.desc : product.desc;
    product.image = data.image ? data.image : product.image;
    product.sku = data.sku ? data.sku : product.sku;
    product.title = data.title ? data.title : product.title;
    product.price = data.price ? data.price : product.price;
    product.stocked = data.stocked ? data.stocked : product.stocked;
    product.updatedAt = new Date();

    return ok(product);
  };
  return withErrorHandling(handler);
}

//
// DELETE /api/v1/products/{id}
// Delete a product
//

swaggerPath({
  method: "delete",
  path: "/api/v1/products/{id}",
  tags: ["products"],
  request: {
    params: z.object({ id: z.number() }),
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
    204: {
      description: "NO_CONTENT",
    },
  },
});

export function DELETE(request: Request, { params }: Context) {
  const handler = () => {
    const product = getById(Number(params.id));
    if (!product) {
      return noContent();
    }

    const deletedProduct = deleteItem(product);
    return ok(deletedProduct);
  };
  return withErrorHandling(handler);
}

//
// GET /api/v1/products/{id}
// Get a product by id
//

swaggerPath({
  method: "get",
  path: "/api/v1/products/{id}",
  tags: ["products"],
  request: {
    params: z.object({ id: z.number() }),
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
    404: {
      description: "NO_FOUND",
    },
  },
});

export function GET(request: Request, { params }: Context) {
  const handler = () => {
    const product = getById(Number(params.id));
    if (!product) {
      throw new NotFoundError(`Product with id ${params.id} not found`);
    }

    return ok(product);
  };
  return withErrorHandling(handler);
}

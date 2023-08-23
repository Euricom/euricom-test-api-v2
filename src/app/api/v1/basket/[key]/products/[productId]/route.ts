/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ok,
  withErrorHandling,
  NotFoundError,
  ConflictError,
} from "@/server/httpUtils";
import {
  addProduct,
  getOrCreateBasket,
  removeProductFromBasket,
  setProductQuantity,
} from "../../../repo";
import { getById as getProductById } from "../../../../products/repo";
import { z } from "zod";
import { swaggerPath } from "@/server/swagger";
import { BasketSchema } from "../../../schema";
import { NextResponse } from "next/server";

type Context = {
  params: {
    key: string;
    productId: string;
  };
};

const QuantitySchema = z.object({
  quantity: z.number(),
});

//
// POST /api/v1/basket/{key}/products/{id}
//

swaggerPath({
  method: "post",
  path: "/api/v1/basket/{key}/products/{productId}",
  description: "Add a product on the basket",
  tags: ["basket"],
  request: {
    params: z.object({
      productId: z
        .string()
        .openapi({ description: "The id of the product to add" }),
      key: z.string().openapi({ description: "The basket key" }),
    }),
    body: {
      content: {
        "application/json": {
          schema: QuantitySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: BasketSchema,
        },
      },
    },
    409: {
      description: "CONFLICT",
    },
    404: {
      description: "NOT_FOUND",
    },
  },
});

export function POST(request: Request, { params }: Context) {
  const handler = async () => {
    const basket = getOrCreateBasket(params.key);
    const product = getProductById(Number(params.productId));
    console.log("product", params, product, basket);

    if (!product || !basket) {
      throw new NotFoundError();
    }
    if (!product.stocked) {
      throw new ConflictError("1202", "Product not in stock");
    }

    const productId = Number(params.productId);
    const body = await request.json();
    const data = QuantitySchema.parse(body);
    let quantity = Math.floor(Number(data.quantity) || 1);

    // add product
    const index = basket.find((item) => item.productId === productId);
    if (!index) {
      basket.push({
        id: basket.reduce((acc, prop) => Math.max(acc, prop.id), 0) + 1,
        productId,
        quantity: quantity,
      });
      return ok(basket, 201);
    }

    // adjust quantity on existing product
    quantity = (basket[index.id - 1]!.quantity || 0) + quantity;
    basket[index.id - 1]!.quantity = quantity;
    return ok(basket, 201);
  };

  return withErrorHandling(handler);
}

//
// PATCH /api/v1/basket/{key}/products/{productId}
//

swaggerPath({
  method: "patch",
  path: "/api/v1/basket/{key}/products/{productId}",
  description: "Update the quantity of a product",
  tags: ["basket"],
  request: {
    params: z.object({
      productId: z
        .string()
        .openapi({ description: "The id of the product to remove" }),
      key: z.string().openapi({ description: "The basket key" }),
    }),
    body: {
      content: {
        "application/json": {
          schema: QuantitySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: BasketSchema,
        },
      },
    },
    404: {
      description: "NOT_FOUND",
    },
    409: {
      description: "CONFLICT",
    },
  },
});

export function OPTIONS() {
  // Issue; it look we need this for PATCH requests
  // Why, I don't know (peterc)
  return ok({});
}

export function PATCH(request: Request, { params }: Context) {
  const handler = async () => {
    const basket = getOrCreateBasket(params.key);
    const product = getProductById(Number(params.productId));
    if (!product || !basket) {
      throw new NotFoundError();
    }
    if (!product.stocked) {
      throw new ConflictError("1202", "Product not in stock");
    }

    const body = await request.json();
    const data = QuantitySchema.parse(body);

    const quantity = Math.floor(Number(data.quantity)) || 0;
    const basketItem = basket.find((item) => item.productId === product.id);
    if (basketItem) {
      if (quantity == 0) {
        removeProductFromBasket(params.key, product.id);
      } else {
        setProductQuantity(params.key, product.id, quantity);
      }
    } else {
      addProduct(params.key, product.id, quantity);
    }
    const updatedBasket = getOrCreateBasket(params.key);
    return ok(updatedBasket);
  };

  return withErrorHandling(handler);
}

//
// DELETE /api/v1/basket/{key}/products/{productId}
//

swaggerPath({
  method: "delete",
  path: "/api/v1/basket/{key}/products/{productId}",
  description: "Remove product from basket",
  tags: ["basket"],
  request: {
    params: z.object({
      productId: z
        .string()
        .openapi({ description: "The id of the product to remove" }),
      key: z.string().openapi({ description: "The basket key" }),
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: BasketSchema,
        },
      },
    },
    404: {
      description: "NOT_FOUND",
    },
  },
});

export function DELETE(request: Request, { params }: Context) {
  const handler = () => {
    const basket = getOrCreateBasket(params.key);
    const productId = Number(params.productId);

    const index = basket.find((item) => item.productId === productId);
    if (!index) {
      throw new NotFoundError(`Product not found with id: ${productId}`);
    }
    basket.splice(index.id - 1, 1);
    return ok(basket);
  };

  return withErrorHandling(handler);
}

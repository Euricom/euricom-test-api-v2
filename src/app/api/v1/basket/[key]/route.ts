import { notFound, ok, withErrorHandling } from "@/server/httpUtils";
import { getOrCreateBasket, clearBasket } from "../repo";
import { z, swaggerPath } from "@/server/swagger";
import { BasketSchema } from "../schema";

type Context = {
  params: {
    key: string;
  };
};

//
// GET /api/v1/basket
//

swaggerPath({
  method: "get",
  path: "/api/v1/basket/{key}",
  description: "Gets all basket items",
  tags: ["basket"],
  request: {
    params: z.object({
      key: z.string(),
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

export function GET(request: Request, { params }: Context) {
  const handler = () => {
    if (!params.key) {
      return notFound("Basket without key not available");
    }

    const basket = getOrCreateBasket(params.key);
    // what does this even mean?
    // it's a test api, to simulate a 500 error
    if (basket.length > 5) {
      throw new Error("I can't handle this, abort abort!");
    }
    return ok(basket);
  };

  return withErrorHandling(handler);
}

//
// DELETE /api/v1/basket/{key}
//

swaggerPath({
  method: "delete",
  path: "/api/v1/basket/{key}",
  description: "Clear the basket",
  tags: ["basket"],
  request: {
    params: z.object({
      key: z.string(),
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
  if (!params.key) {
    return notFound("Basket without key not available");
  }

  const previousBasket = clearBasket(params.key);
  return ok(previousBasket);
}

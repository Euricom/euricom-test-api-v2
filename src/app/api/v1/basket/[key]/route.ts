import { notFound, ok, internalServerError } from "@/server/httpUtils";
import { getOrCreateBasket, clearBasket } from "@/server/repos/basket";

type Context = {
  params: {
    key: string;
  };
};

/**
 * @swagger
 * /api/v1/basket/{key}:
 *   get:
 *     description: Gets all basket items
 *     tags: [basket]
 *     parameters:
 *     - in: path
 *       name: key
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/basket'
 *       404:
 *         description: NOT_FOUND
 */
export function GET(request: Request, { params }: Context) {
  if (!params.key) {
    return notFound("Basket without key not available");
  }

  const basket = getOrCreateBasket(params.key);
  // what does this even mean?
  // it's a test api, to simulate a 500 error
  if (basket.length > 5) {
    throw internalServerError({ message: "Something went wrong", details: {} });
  }
  return ok(basket);
}

/**
 * @swagger
 * /api/v1/basket/{key}:
 *   delete:
 *     description: Clear the basket
 *     tags: [basket]
 *     parameters:
 *     - name: "key"
 *       in: "path"
 *       required: true
 *       type: "string"
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/basket'
 *       404:
 *         description: NOT_FOUND
 */
export function DELETE(request: Request, { params }: Context) {
  if (!params.key) {
    return notFound("Basket without key not available");
  }

  const previousBasket = clearBasket(params.key);
  return ok(previousBasket);
}

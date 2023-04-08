/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ok,
  withErrorHandling,
  NotFoundError,
  ConflictError,
} from "@/server/httpUtils";
import { getOrCreateBasket } from "../../../repo";
import { getById as getProductById } from "../../../../products/repo";
import { z } from "zod";

type Context = {
  params: {
    key: string;
    id: string;
  };
};

const addProductSchema = z.object({
  quantity: z.number(),
});

/**
 * @swagger
 * /api/v1/basket/{key}/products/{id}:
 *   post:
 *     description: Add a product on the basket
 *     tags: [basket]
 *     parameters:
 *     - in: path
 *       name: key
 *       description: The basket key
 *       required: true
 *       schema:
 *         type: string
 *     - in: path
 *       name: id
 *       description: The id of the product to add
 *       required: true
 *       schema:
 *         type: string
 *     consumes:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                quantity:
 *                  type: number
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *            schema:
 *             $ref: '#/components/schemas/basket'
 *       409:
 *         description: CONFLICT
 *       404:
 *         description: NOT_FOUND
 */
export function POST(request: Request, { params }: Context) {
  const handler = async () => {
    const basket = getOrCreateBasket(params.key);
    const product = getProductById(Number(params.id));
    if (!product || !basket) {
      throw new NotFoundError();
    }
    if (!product.stocked) {
      throw new ConflictError("1202", "Product not in stock");
    }

    const productId = Number(params.id);
    const json = await request.json();
    const data = addProductSchema.parse(json);
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

/**
 * @swagger
 * /api/v1/basket/{key}/products/{id}:
 *   delete:
 *     description: Remove product from basket
 *     tags: [basket]
 *     parameters:
 *     - in: path
 *       name: key
 *       description: The basket key
 *       required: true
 *       schema:
 *         type: string
 *     - in: path
 *       name: id
 *       description: The id of the product to add
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
export function DELETE(request: Request, { params }: Context) {
  const handler = () => {
    const basket = getOrCreateBasket(params.key);
    const productId = Number(params.id);

    const index = basket.find((item) => item.productId === productId);
    if (!index) {
      throw new NotFoundError(`Product not found with id: ${productId}`);
    }
    basket.splice(index.id - 1, 1);
    return ok(basket);
  };

  return withErrorHandling(handler);
}

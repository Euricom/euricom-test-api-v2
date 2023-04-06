import { badRequest, ok } from "@/server/httpUtils";
import { add, getAll, productSchema } from "@/server/repos/products";
import sortOn from "sort-on";
import { chain } from "lodash";

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     description: Gets all products
 *     tags: [products]
 *     parameters:
 *     - in: query
 *       name: page
 *       schema:
 *         type: integer
 *     - in: query
 *       name: pageSize
 *       schema:
 *         type: integer
 *     - in: query
 *       name: sortBy
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties:
 *                items:
 *                  $ref: '#/components/schemas/product'
 *                total:
 *                  type: number
 *                page:
 *                  type: number
 *                pageSize:
 *                  type: number
 */
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 0;
  const pageSize = Number(searchParams.get("pageSize")) || 20;
  const sortBy = searchParams.get("sort") || "";
  console.log("page:", page);
  console.log("pageSize:", pageSize);
  console.log("sortBy:", sortBy);

  let entities = getAll();
  if (sortBy) {
    entities = sortOn(entities, sortBy);
  }
  const subset = chain(entities)
    .drop(page * pageSize)
    .take(pageSize)
    .value();

  return ok({
    page,
    pageSize,
    total: entities.length,
    items: subset,
  });
}

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     description: Create a product
 *     tags: [products]
 *     consumes:
 *       - application/json
 *     parameters:
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/product'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *            schema:
 *             $ref: '#/components/schemas/product'
 *       404:
 *         description: NOT_FOUND
 */
export function POST(request: Request) {
  const result = productSchema.safeParse(request.body);
  if (!result.success) {
    return badRequest({
      message: "Invalid product",
      details: result.error.format(),
    });
  }

  const product = {
    ...result.data,
    id: new Date().valueOf(),
  };
  add(product);
  return ok(product);
}

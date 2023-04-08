/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Basket } from "./schema";

type Baskets = {
  [key: string]: Basket;
};

const baskets: Baskets = {};

export function getBasket(checkoutID: string) {
  return baskets[checkoutID];
}

export function getOrCreateBasket(checkoutID: string) {
  let basket = baskets[checkoutID];
  if (!baskets[checkoutID]) {
    baskets[checkoutID] = [];
    basket = baskets[checkoutID];
    basket!.push({
      id: 1,
      productId: 1,
      quantity: 1,
    });
    basket!.push({
      id: 2,
      productId: 2,
      quantity: 4,
    });
  }
  return basket!;
}

export const removeProductFromBaskets = (productId: number) => {
  for (const prop in baskets) {
    if (baskets[prop]) {
      baskets[prop] = baskets[prop]!.filter(
        (basket) => basket.productId !== productId
      );
    }
  }
};

export const clearBasket = (checkoutID: string, refill = false) => {
  const previousBasket = getOrCreateBasket(checkoutID);
  baskets[checkoutID] = []; // clear basket
  if (refill) {
    baskets[checkoutID]!.push({
      id: 1,
      productId: 1,
      quantity: 1,
    });
    baskets[checkoutID]!.push({
      id: 2,
      productId: 2,
      quantity: 4,
    });
  }
  return previousBasket;
};

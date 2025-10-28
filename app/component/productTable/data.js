import { getProducts } from "@/app/action/ProductAction";
import {
  getTransactions,
  getSellersTransaction,
} from "@/app/action/TransactionAction";
import { getUserProductById } from "@/lib/logic/product";

export const getData = async (id) => {
  try {
    const products = await getProducts(id);
    console.log(products);
    return products.map(({ _id, name, basePrice, variations, productCode }) => {
      console.log(productCode);
      return {
        id: _id,
        name: name,
        amount: basePrice,
        variations,
        productCode,
      };
    });
  } catch (error) {
    console.log(error);
  }
};

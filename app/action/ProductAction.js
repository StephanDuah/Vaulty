"use server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/database";

import Product from "@/lib/models/product";
import { generateUniqueId } from "@/lib/utils";

export async function createProduct(formData) {
  await connectDB();
  const session = await auth();
  const { name, basePrice, description, variations } = formData;
  const id = session?.user?.id;
  const productCode = generateUniqueId(6);

  try {
    const product = await Product.create({
      name,
      productCode,
      basePrice,
      description,
      variations,
      sellerId: id,
    });

    return { success: true, product };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
}

export async function getProducts(id) {
  try {
    await connectDB();

    const products = await Product.find({ sellerId: id });
    const cleanedProducts = products.map((product) => {
      const obj = product.toObject();
      obj._id = obj._id.toString();
      obj.sellerId = obj.sellerId?.toString();
      return obj;
    });

    return cleanedProducts;
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
}

"use server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/database";

import Product from "@/lib/models/product";
import User from "@/lib/models/User";
import { generateUniqueId } from "@/lib/utils";
import { revalidateTag } from "next/cache";

export async function createProduct(formData) {
  await connectDB();
  const session = await auth();
  const { name, basePrice, description, variations } = formData;
  const id = session?.user?.id;

  // Check if seller is verified
  const seller = await User.findById(id);
  if (!seller || seller.verification !== "verified") {
    return {
      success: false,
      message:
        "Your account must be verified before you can create products. Please complete KYC verification.",
    };
  }

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
    return [];
  }
}

export async function deleteProduct(id) {
  await connectDB();
  const session = await auth();
  const sellerId = session?.user?.id;

  try {
    // Check if product exists and belongs to seller
    const product = await Product.findOne({ _id: id, sellerId });
    if (!product) {
      return {
        status: "error",
        message: "Product not found or you don't have permission to delete it",
      };
    }

    await Product.findByIdAndDelete(id);
    return { status: "success", message: "Product deleted" };
  } catch (e) {
    console.log(e);
    return { status: "error", message: "Something went wrong" };
  }
}

export async function updateProduct(id, formData) {
  await connectDB();
  const session = await auth();
  const { name, basePrice, description, variations } = formData;
  const sellerId = session?.user?.id;

  try {
    // Check if product exists and belongs to seller
    const product = await Product.findOne({ _id: id, sellerId });
    if (!product) {
      return {
        success: false,
        message: "Product not found or you don't have permission to edit it",
      };
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, basePrice, description, variations },
      { new: true, runValidators: true },
    );

    return { success: true, product: updatedProduct };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
}

export async function getProductById(id) {
  await connectDB();
  try {
    console.log("Getting product by ID:", id);
    const product = await Product.findById(id);
    console.log("Found product:", product);

    if (!product) {
      return { success: false, message: "Product not found" };
    }
    return { success: true, product, message: "Product found" };
  } catch (error) {
    console.error("Error in getProductById:", error);
    return { success: false, message: error.message };
  }
}

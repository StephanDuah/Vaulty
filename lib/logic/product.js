//Creating Crud logic for products

import Product from "../models/product.js";
import { connectDB } from "../database/index.js";
// Create Product
export const createProduct = async (productData) => {
  await connectDB();
  try {
    const product = await Product.create(productData);
    return product;
  } catch (error) {
    throw new Error("Error creating product: " + error.message);
  }
};

// Get Product by ID
export const getProductById = async (productId) => {
  await connectDB();
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error) {
    throw new Error("Error fetching product: " + error.message);
  }
};

// Get Product by ID
export const getUserProductById = async (userId) => {
  await connectDB();
  try {
    const product = await Product.find({
      sellerId: userId,
    });

    console.log(product);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error) {
    throw new Error("Error fetching product: " + error.message);
  }
};

// Get All Products
export const getAllProducts = async () => {
  await connectDB();
  try {
    const products = await Product.find({});
    return products;
  } catch (error) {
    throw new Error("Error fetching products: " + error.message);
  }
};

// Get Total number of Products
export const getTotalProducts = async () => {
  await connectDB();
  try {
    const totalProducts = await Product.countDocuments({});
    return totalProducts;
  } catch (error) {
    throw new Error("Error fetching total products: " + error.message);
  }
};

// Get edit Product by ID
export const editProduct = async (productId, productData) => {
  await connectDB();
  try {
    const product = await Product.findByIdAndUpdate(productId, productData, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error) {
    throw new Error("Error updating product: " + error.message);
  }
};

// Delete Product
export const deleteProduct = async (productId) => {
  await connectDB();
  try {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error) {
    throw new Error("Error deleting product: " + error.message);
  }
};

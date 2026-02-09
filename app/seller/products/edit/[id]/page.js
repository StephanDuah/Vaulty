import { auth } from "@/auth";
import { connectDB } from "@/lib/database";
import User from "@/lib/models/User";
import { redirect } from "next/navigation";
import { getProductById } from "@/app/action/ProductAction";
import EditProductForm from "@/app/component/seller/products/EditProductForm";
import React from "react";

const page = async ({ params }) => {
  const session = await auth();
  const id = session?.user?.id;

  // Check if seller is verified
  await connectDB();
  const seller = await User.findById(id);
  if (!seller || seller.verification !== "verified") {
    redirect("/seller/profile?verification=required");
  }

  // Get product data
  console.log("Fetching product with ID:", params.id);
  const result = await getProductById(params.id);
  console.log("Product fetch result:", result);

  const { success, product, message } = result;

  if (!success) {
    redirect("/seller/products");
  }

  // Check if product belongs to current seller
  if (product.sellerId.toString() !== id) {
    redirect("/seller/products");
  }

  return (
    <div>
      <EditProductForm product={JSON.parse(JSON.stringify(product))} />
    </div>
  );
};

export default page;

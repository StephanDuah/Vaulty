import ProductForm from "@/app/component/seller/products/productForm";
import { auth } from "@/auth";
import { connectDB } from "@/lib/database";
import User from "@/lib/models/User";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await auth();
  const id = session?.user?.id;

  // Check if seller is verified
  await connectDB();
  const seller = await User.findById(id);
  if (!seller || seller.verification !== "verified") {
    redirect("/seller/profile?verification=required");
  }

  return (
    <div>
      <ProductForm />
    </div>
  );
};

export default page;

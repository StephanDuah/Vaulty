import { columns } from "@/app/component/productTable/column";
import { getData } from "@/app/component/productTable/data";
import DataTable from "@/app/component/productTable/DataTable";
import ProductForm from "@/app/component/seller/products/productForm";
import { auth } from "@/auth";
import { connectDB } from "@/lib/database";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = async () => {
  await connectDB();
  const session = await auth();
  const id = session.user.id;

  const data = await getData(id);

  return (
    <div className="md:p-5">
      <div className="float-end">
        <Link
          className="bg-primary text-white px-5 py-3 tex-sm inline-flex items-center space-x-2 "
          href={"/seller/products/create"}
        >
          <Plus /> <span className="text-sm">Add Product</span>
        </Link>
      </div>
      <div className="my-20">
        <DataTable columns={columns} data={data} />{" "}
      </div>
    </div>
  );
};

export default page;

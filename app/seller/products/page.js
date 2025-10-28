import { columns } from "@/app/component/productTable/column";
import { getData } from "@/app/component/productTable/data";
import DataTable from "@/app/component/productTable/DataTable";
import ProductForm from "@/app/component/seller/products/productForm";
import { auth } from "@/auth";
import Link from "next/link";
import React from "react";

const page = async () => {
  const session = await auth();
  const id = session.user.id;

  const data = await getData(id);

  return (
    <div className="p-5">
      <div>
        <Link
          className="bg-primary text-white px-6 py-3 rounded-full"
          href={"/seller/products/create"}
        >
          Add Product
        </Link>
      </div>
      <DataTable columns={columns} data={data} />{" "}
    </div>
  );
};

export default page;

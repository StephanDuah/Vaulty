import React from "react";
import Dashboard from "../component/seller/Dashboard";
import DataTable from "../component/productTable/DataTable";
import { getData } from "../component/productTable/data";
import { columns } from "../component/productTable/column";
import { auth } from "@/auth";
import DisplayTransactions from "../component/seller/DisplayTransactions";
import Content from "../component/content";
import QrcodeGenerator from "../component/QrcodeGenerator";
const page = async () => {
  const session = await auth();
  if (!session) {
    console.log("hi");
  }
  const data = await getData();

  console.log(data);
  return (
    <div>
      <Content />
    </div>
  );
};

export default page;

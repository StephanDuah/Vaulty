import { columns } from "@/app/component/transactionTable/column";
import { getData } from "@/app/component/transactionTable/data";

import DataTable from "@/app/component/transactionTable/DataTable";
import { auth } from "@/auth";
import React from "react";

const page = async () => {
  const session = await auth();
  const id = session.user.id;

  const data = await getData(id);

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default page;

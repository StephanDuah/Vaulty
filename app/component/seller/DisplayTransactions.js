import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import React from "react";
import DataTable from "../productTable/DataTable";

import { auth } from "@/auth";
import { getData } from "../productTable/data";
import { columns } from "../productTable/column";

const DisplayTransactions = async () => {
  //   const { user } = await auth();

  const { user } = await auth();

  const data = await getData(user?.id);

  return (
    <div>
      <Tabs defaultValue="account" className="w-[full] space-y-8 p-10">
        <TabsList className="border-b border-gray-600/50 w-full  justify-start space-x-5 rounded-none text-xl">
          <TabsTrigger className=" text-lg text-gray-600" value="account">
            All
          </TabsTrigger>
          <TabsTrigger className=" text-lg text-gray-600" value="action">
            Action Required
          </TabsTrigger>
          <TabsTrigger className=" text-lg text-gray-600" value="open">
            Open
          </TabsTrigger>
          <TabsTrigger className=" text-lg text-gray-600" value="close">
            Closed
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="py-10">
          {data ? <DataTable columns={columns} data={data} /> : "no data here"}
        </TabsContent>
        <TabsContent value="action">
          Change your password here. &#162 No results.
        </TabsContent>
        <TabsContent value="open">Change your password here.</TabsContent>
        <TabsContent value="close">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default DisplayTransactions;

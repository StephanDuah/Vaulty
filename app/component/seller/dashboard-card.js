import { Card } from "@/components/ui/card";
import React from "react";

const Wrapper = ({ children }) => {
  return (
    <Card className="  bg-white rounded-2xl shadow-md p-4 border-zinc-200 border w-full  my-4 dark:bg-zinc-900/65 dark:border-zinc-700">
      {children}
    </Card>
  );
};

export default Wrapper;

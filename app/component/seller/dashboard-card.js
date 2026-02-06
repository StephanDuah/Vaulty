import { Card } from "@/components/ui/card";
import React from "react";

const Wrapper = ({ children }) => {
  return (
    <Card className="bg-white rounded-2xl shadow-md p-4 border border-slate-200 w-full my-4">
      {children}
    </Card>
  );
};

export default Wrapper;

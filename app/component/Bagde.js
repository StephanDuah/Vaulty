import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const BagdeComponent = ({ icon, className, title }) => {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "bg-blue-500 text-white dark:bg-blue-600  py-2 rounded-full px-6 text-sm flex gap-2",
        className
      )}
    >
      {icon && icon}
      {title}
    </Badge>
  );
};

export default BagdeComponent;

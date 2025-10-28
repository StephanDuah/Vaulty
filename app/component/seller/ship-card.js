import { Card, CardTitle } from "@/components/ui/card";
import { displayCurrency } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import React from "react";

const ShipCard = ({ transaction }) => {
  const { _id, buyerDetail, daysLeft, totalAmount } = transaction;

  return (
    <Card className="bg-white dark:bg-zinc-900  rounded-xl border dark:border-zinc-600 border-gray-300">
      <div className="flex items-center justify-between border-b border-zinc-400 dark:border-zinc-600 px-4 py-2">
        <span>Days Left</span>
        <p className="text-2xl italic font-medium">{daysLeft}</p>
      </div>
      <div className="flex flex-col p-4 gap-2">
        <h3 className="text-sm font-bold">{JSON.stringify(_id)}</h3>
        <p className="text-sm text-gray-300 dark:text-zinc-400">
          {`from: ${buyerDetail.firstName} ${buyerDetail.lastName}`}
        </p>
        <p className="text-sm">{displayCurrency(totalAmount)}</p>
      </div>
      <Link
        href={`/seller/Transaction/${transaction._id}`}
        className="bg-transparent flex text-sm justify-center items-center gap-2 border-t dark:border-zinc-700 dark:hover:bg-zinc-800/65 rounded-b-xl border-gray-400 p-4 text-center"
      >
        View Details <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </Card>
  );
};

export default ShipCard;

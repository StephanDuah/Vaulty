import React from "react";
import Wrapper from "./dashboard-card";

import ThemeButton from "../theme/button";
import { auth } from "@/auth";
import { getTransactionWithDeadline } from "@/lib/logic/transactions";
import ShipCard from "./ship-card";

const ShipNow = async () => {
  const { user } = await auth();
  const transactions = await getTransactionWithDeadline(user?.id);

  if (!transactions || transactions.length === 0)
    return (
      <Wrapper>
        <div className="p-4 text-center text-gray-500">
          There is no transaction at the moment
        </div>
      </Wrapper>
    );

  return (
    <Wrapper>
      <p className="text">Ship Now</p>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4">
        {transactions.map((transaction) => (
          <ShipCard key={transaction._id} transaction={transaction} />
        ))}
      </div>
    </Wrapper>
  );
};

export default ShipNow;

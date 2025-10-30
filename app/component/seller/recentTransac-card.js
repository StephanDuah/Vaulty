import React from "react";
import Wrapper from "./dashboard-card";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { getRecentTransaction } from "@/lib/logic/transactions";
import { Clock, CheckCircle, XCircle, PauseCircle } from "lucide-react";
import Link from "next/link";
import { displayCurrency, formatGhanaPhone } from "@/lib/utils";

const baseClass =
  "w-[35px] h-[35px] rounded-md text-white flex items-center justify-center";

// Optional: Adjust icon size if needed (e.g., w-5 h-5)
const iconMap = {
  pending: (
    <span
      className={`bg-yellow-300 ${baseClass} animate-pulse h-5 w-5`}
      title="Pending"
    >
      <Clock />
    </span>
  ),
  shipped: (
    <span
      className={`bg-blue-500 ${baseClass}  hover:animate-bounce h-5 w-5 `}
      title="Held"
    >
      <PauseCircle />
    </span>
  ),
  delievered: (
    <span
      className={`bg-green-600 ${baseClass} animate-fade-in h-5 w-5`}
      title="Completed"
    >
      <CheckCircle />
    </span>
  ),
  cancelled: (
    <span
      className={`bg-red-500 ${baseClass}  hover:animate-shake h-5 w-5`}
      title="Failed"
    >
      <XCircle />
    </span>
  ),
};

const DisplayPrice = ({ status, amount }) => {
  let price = {
    pending: (
      <span className="text-yellow-800 text-sm font-semibold float-end">
        {displayCurrency(amount)}
      </span>
    ),
    shipped: (
      <span className="text-blue-800 text-sm font-semibold float-end">
        {displayCurrency(amount)}
      </span>
    ),
    cancelled: (
      <span className="text-red-800 text-sm font-semibold float-end">
        - {displayCurrency(amount)}
      </span>
    ),
    delievered: (
      <span className="text-green-800 text-sm font-semibold float-end">
        + {displayCurrency(amount)}
      </span>
    ),
  };
  return price[status];
};

const RecentTransaction = async () => {
  const session = await auth();
  const user = session.user;
  const recentTransaction = await getRecentTransaction(user.id);
  if (!recentTransaction || recentTransaction.length === 0) {
    return (
      <Wrapper>
        <Card>
          <CardHeader>Recents Transactions</CardHeader>
          <CardContent>Theres no transactions at the moment</CardContent>
        </Card>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Card>
        <CardHeader>Recents Transaction</CardHeader>
        <CardContent>
          <div className="flex-col gap-10 p-4 space-y-5">
            {recentTransaction.map((transacations) => {
              return (
                <div
                  key={transacations._id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-2 ">
                    {iconMap[transacations.transactionStatus]}
                    <div>
                      <p className="text-lg font-bold">
                        {transacations?.buyerDetail?.firstName}
                      </p>
                      <p className=" capitalize">
                        {transacations.transactionStatus}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      {" "}
                      <DisplayPrice
                        amount={transacations.totalAmount}
                        status={transacations.transactionStatus}
                      />
                    </p>
                    <Link href={`/seller/Transaction/${transacations._id}`}>
                      <Button variant="outline" className="hover:bg-primary">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter>
          <Link href={"/seller/Transaction"} className="w-full text-center">
            <Button className="w-full">View All transactions</Button>
          </Link>
        </CardFooter>
      </Card>
    </Wrapper>
  );
};

export default RecentTransaction;

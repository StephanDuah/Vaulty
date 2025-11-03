import DisplayTransactions from "@/app/component/seller/DisplayTransactions";
import TransactionDetails from "@/app/component/seller/TransactionDetails";
import { connectDB } from "@/lib/database";
import { Transaction } from "@/lib/models/Transaction";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
const getTransactions = async (id) => {
  try {
    await connectDB();
    const transaction = await Transaction.findById(id);
    if (!transaction) notFound();

    return JSON.parse(JSON.stringify(transaction));
  } catch (error) {
    console.log(error);
  }
};

const page = async ({ params }) => {
  const { id } = await params;
  const transaction = await getTransactions(id);

  return (
    <Suspense fallback={<div>Loading Transaction....</div>}>
      <TransactionDetails transaction={transaction} />;
    </Suspense>
  );
};

export default page;

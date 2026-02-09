import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/database";
import CheckoutForm from "@/app/component/payment/CheckoutForm";
import CheckoutSkeleton from "@/app/component/payment/CheckoutSkelton";

const getSeller = async (slug) => {
  await connectDB();
  await new Promise((resolve) => setTimeout(resolve, 4000)); // Ensure delay is awaited
  const user = await User.findOne({ slug }).lean();
  if (!user) notFound();

  // Check if seller is verified
  if (user.verification !== "verified") {
    notFound();
  }

  return JSON.parse(JSON.stringify(user));
};

const Payment = async ({ searchParams }) => {
  const { business } = await searchParams;
  const user = await getSeller(business); // ✅ Await function

  return (
    <div>
      <Suspense fallback={<CheckoutSkeleton />}>
        <CheckoutForm user={user} />
      </Suspense>
    </div>
  );
};

export default Payment;

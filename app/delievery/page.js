import { Card } from "@/components/ui/card";
import { Package, MapPin, Clock, User } from "lucide-react";
import Link from "next/link";
import ConfirmDelivery from "./ConfirmDelievery";
import { notFound } from "next/navigation";
import { Transaction } from "@/lib/models/Transaction";
import NotFound from "../seller/not-found";
import { connectDB } from "@/lib/database";
import { displayCurrency } from "@/lib/utils";

const MOCK_ORDER = {
  address: "123 Main Street, Accra, Ghana",
  deliveryDate: "2025-01-12",
};

export default async function ConfirmDeliveryPage({ searchParams }) {
  await connectDB();

  const { transacId } = await searchParams;
  if (!transacId) notFound();

  const transaction = await Transaction.findById(transacId).populate(
    "sellerId"
  );

  if (!transaction) return <NotFound />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-0 shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-8 py-6 text-white rounded-t-lg">
          <h1>{`${transaction.buyerDetail.firstName} ${transaction.buyerDetail.lastName}`}</h1>
          <h1 className="text-2xl font-bold mb-1">Confirm Package Delivery</h1>
          <p>Enter the delivery code provided with your package</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Order Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-primary" />
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Product
                  </label>
                </div>
                <p className="text-base font-semibold text-gray-900">
                  {transaction.items.map((i) => (
                    <span key={i._id}>{i.name}</span>
                  ))}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-primary" />
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    From Seller
                  </label>
                </div>
                <p className="text-base font-semibold text-gray-900 capitalize">
                  {transaction.sellerId.businessName}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Delivery Address
                  </label>
                </div>
                <p className="text-base font-semibold text-gray-900">
                  {transaction.deliveryAddress || MOCK_ORDER.address}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Delivery Date
                  </label>
                </div>
                <p className="text-base font-semibold text-gray-900">
                  {transaction.deliveryDate || MOCK_ORDER.deliveryDate}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="flex flex-col-reverse md:flex-row md:items-center justify-between bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {displayCurrency(transaction.totalAmount)}
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <p className="text-base font-mono font-semibold text-primary">
                {transacId}
              </p>
            </div>
          </div>

          {/* Confirm Delivery Section */}
          <ConfirmDelivery id={transacId} />

          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            Can’t find your code?{" "}
            <Link
              href="/seller/help"
              className="text-primary font-semibold hover:underline"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

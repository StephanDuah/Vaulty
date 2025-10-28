"use client";
import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { releasefund } from "../action/TransactionAction";

const ConfirmDelivery = ({ id }) => {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showCodeError, setShowCodeError] = useState(false);

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
    setShowCodeError(false);
    setError("");
  };

  const handleConfirmDelivery = async () => {
    if (!code || code.length !== 6) {
      setShowCodeError(true);
      setError("Please enter a valid 6-digit code");
      return;
    }

    setIsVerifying(true);
    setError("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await releasefund(id, code);
    if (response.status === "success") {
      setIsSuccess(true);
    } else {
      setError(response.message);
      setShowCodeError(true);
    }

    setIsVerifying(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <div className="p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400 rounded-full blur-lg opacity-50"></div>
                <CheckCircle2 className="w-16 h-16 text-emerald-600 relative" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Delivery Confirmed!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for confirming receipt of your package. Your order has
              been successfully completed.
            </p>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <p className="text-base font-semibold text-gray-900 mb-4">{id}</p>

              <p className="text-sm text-gray-600 mb-1">Product</p>
              <p className="text-base font-semibold text-gray-900"></p>
            </div>

            <div className="bg-blue-50 border border-primary/20 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-600">
                Seller has been notified and will receive payment shortly.
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/buyer/purchase">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  View All Orders
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full bg-transparent">
                  Continue Shopping
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              Need help?{" "}
              <Link
                href="/seller/help"
                className="text-primary font-semibold hover:underline"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </Card>
      </div>
    );
  }
  return (
    <>
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Enter 6-Digit Delivery Code
        </label>
        <p className="text-sm text-gray-600 mb-4">
          The delivery code is usually printed on your receipt or in the
          delivery notification message.
        </p>

        <div className="mb-4">
          <input
            type="text"
            value={code}
            onChange={handleCodeChange}
            placeholder="000000"
            maxLength="6"
            className={`w-full h-14 text-center text-3xl font-bold tracking-widest rounded-lg border-2 transition-colors ${
              showCodeError
                ? "border-red-500 bg-red-50 text-red-600"
                : "border-primary/20 bg-gray-50 text-gray-900 focus:border-primary focus:bg-white focus:outline-none"
            }`}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Tip:</span> Make sure to enter the
            code exactly as shown on your receipt. The code is case-sensitive.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleConfirmDelivery}
          disabled={isVerifying || code.length !== 6}
          className="w-full h-12 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold"
        >
          {isVerifying ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Verifying...
            </span>
          ) : (
            "Confirm Delivery"
          )}
        </Button>

        <Link href="/buyer/purchase">
          <Button
            variant="outline"
            className="w-full h-12 font-semibold bg-transparent"
          >
            Cancel
          </Button>
        </Link>
      </div>
    </>
  );
};

export default ConfirmDelivery;

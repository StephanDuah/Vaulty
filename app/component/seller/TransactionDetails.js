"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { confirmShipment } from "@/app/action/TransactionAction";
import { displayCurrency, formatDate } from "@/lib/utils";

export default function TransactionDetails({ transaction }) {
  const router = useRouter();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false);

  const handleConfirmDelivery = async () => {
    console.log("Delivery confirmed for transaction:", transaction._id);
    const response = await confirmShipment(transaction._id);

    setConfirmDialogOpen(false);
    router.refresh();
  };

  const handleDispute = () => {
    // Logic to submit dispute
    console.log("Dispute submitted for transaction:", transaction._id);
    setDisputeDialogOpen(false);
  };

  return (
    <div className="min-h-screen ">
      <header className=" shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold  flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="mr-2"
              onClick={() => router.push("/seller")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            Transaction Details
          </h1>
          <Package2 className="h-6 w-6 " />
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Transaction {transaction.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium ">Buyer</p>
                <p className="mt-1 text-sm ">
                  {transaction.buyerDetail.firstName}{" "}
                  {transaction.buyerDetail.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium ">Product</p>
                <div className="mt-1 text-sm flex flex-col gap-2">
                  {transaction.items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <p>{item.name}</p>
                      <p>x {item.quantity}</p>
                      <p>{displayCurrency(item.baseprice)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium ">Amount</p>
                <p className="mt-1 text-sm ">
                  {displayCurrency(transaction?.totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium ">Date</p>
                <p className="mt-1 text-sm ">
                  {formatDate(transaction.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">transactionStatus</p>
                <Badge
                  className="mt-1"
                  variant={
                    transaction.transactionStatus === "delievered"
                      ? "success"
                      : transaction.transactionStatus === "Disputed"
                      ? "destructive"
                      : transaction.transactionStatus === "shipped"
                      ? "success"
                      : "default"
                  }
                >
                  {transaction.transactionStatus}
                </Badge>
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              {transaction.transactionStatus === "pending" && (
                <Button onClick={() => setConfirmDialogOpen(true)}>
                  Confirm shipping
                </Button>
              )}
              {transaction.transactionStatus !== "Completed" &&
                transaction.transactionStatus !== "Disputed" && (
                  <Button
                    variant="outline"
                    onClick={() => setDisputeDialogOpen(true)}
                  >
                    Dispute Transaction
                  </Button>
                )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Confirm Delivery Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delivery</DialogTitle>
            <DialogDescription>
              Are you sure you want to confirm shipping for this transaction?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmDelivery}>Confirm Shipping</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dispute Dialog */}
      <Dialog open={disputeDialogOpen} onOpenChange={setDisputeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispute Transaction</DialogTitle>
            <DialogDescription>
              Please provide details about why you are disputing this
              transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dispute-reason" className="text-right">
                Reason for Dispute
              </Label>
              <Input
                id="dispute-reason"
                className="col-span-3"
                placeholder="Enter your reason here"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dispute-details" className="text-right">
                Additional Details
              </Label>
              <textarea
                id="dispute-details"
                className="col-span-3 min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Provide any additional information about the dispute"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDisputeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleDispute}>Submit Dispute</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

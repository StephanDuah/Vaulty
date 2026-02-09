import { Transaction } from "../models/Transaction";
import { Escrow } from "../models/Escrow";

import User from "../models/User";
import { differenceInDays, isBefore } from "date-fns";
import { connectDB } from "../database";

import { sendDelayedShippingReminder } from "../mailing/sms";
import { getmessageInfo } from "@/app/action/TransactionAction";
export const checkSellerDeadline = async (transactions) => {
  await connectDB();
  try {
    const now = new Date();

    for (const transaction of transactions) {
      const escrow = await Escrow.findOne({ transactionId: transaction._id });
      const user = await User.findOne({ _id: transaction.sellerId });
      const info = await getmessageInfo(
        transaction,
        user,
        escrow,
        transaction._id,
      );
      if (escrow.status !== "held") continue;
      const deadline = escrow.heldAt;
      console.log("HeldAt: " + deadline);
      deadline.setDate(deadline.getDate() + user.dtd);
      console.log("ActualDeadline: " + deadline);

      console.log(".....................................................");
      console.log(isBefore(deadline, now));
      if (
        differenceInDays(now, deadline) >= 2 &&
        !transaction.sellerReminderSent
      ) {
        //send message to the seller and buyer

        await sendDelayedShippingReminder(info, "seller");
        await sendDelayedShippingReminder(info, "buyer");

        //set sellerReminder = false
        await Transaction.updateOne(
          { _id: transaction._id },
          { $set: { sellerReminderSent: true } },
        );
      }

      if (isBefore(deadline, now)) {
        //Refund the money

        handleRefund(transaction);
        sendRefundMessageSeller(transaction);

        //Send messages
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const checkBuyerDeadline = async (transactions) => {
  await connectDB();
  try {
    const now = new Date();

    for (const transaction of transactions) {
      const escrow = await Escrow.findOne({ transactionId: transaction._id });
      const user = await User.findOne({ _id: transaction.sellerId });
      const info = await getmessageInfo(
        transaction,
        user,
        escrow,
        transaction._id,
      );

      // Skip if escrow is not in held status
      if (escrow.status !== "held") continue;

      // Check if buyer confirmation deadline has passed
      // Buyer has 7 days to confirm after shipping
      const shippingDate = transaction.shippingDate;
      if (!shippingDate) continue; // Skip if not shipped yet

      const buyerDeadline = new Date(shippingDate);
      buyerDeadline.setDate(buyerDeadline.getDate() + 7); // 7 days to confirm
      console.log("Shipping Date: " + shippingDate);
      console.log("Buyer Deadline: " + buyerDeadline);
      console.log("Current Date: " + now);
      console.log(".....................................................");
      console.log(isBefore(buyerDeadline, now));

      // If buyer deadline passed and buyer hasn't confirmed
      if (isBefore(buyerDeadline, now) && !transaction.buyerReminderSent) {
        // Auto-confirm goods received and release money to seller

        await Transaction.updateOne(
          { _id: transaction._id },
          {
            $set: {
              transactionStatus: "delivered",
              buyerReminderSent: true,
            },
          },
        );

        // Update escrow status to released
        await Escrow.updateOne(
          { transactionId: transaction._id },
          { $set: { status: "released" } },
        );

        console.log(
          "Auto-confirmed transaction " +
            transaction._id +
            " - buyer deadline passed",
        );

        // Send notifications to both parties
        await sendBuyerReminder(); // Confirmation notification
        await sendSellerReminder(info); // Payment release notification
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const handleRefund = async (transactionId) => {
  await connectDB();
  try {
    const transaction = await Transaction.findById(transactionId);
    const escrow = await Escrow.findOne({ transactionId });

    if (!transaction || !escrow) {
      console.log("Transaction or Escrow not found");
      return;
    }

    // Prevent duplicate refunds
    if (
      transaction.transactionStatus === "cancelled" &&
      escrow.status === "refunded"
    ) {
      console.log("Already refunded");
      return;
    }

    // Proceed only if refund conditions are met
    if (
      transaction.transactionStatus !== "pending" ||
      escrow.status !== "held"
    ) {
      console.log("Refund not allowed");
      return;
    }

    await Transaction.updateOne(
      { _id: transaction._id },
      { $set: { transactionStatus: "cancelled" } },
    );

    await User.updateOne(
      { _id: transaction.sellerId },
      {
        $inc: {
          escrowScore: -500,
        },
      },
    );

    escrow.status = "refunded";
    escrow.refundAt = new Date();
    await escrow.save();

    console.log("Money refunded");
  } catch (error) {
    console.log(error);
  }
};

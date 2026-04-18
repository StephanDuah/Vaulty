import { Transaction } from "../models/Transaction";
import { Escrow } from "../models/Escrow";
import User from "../models/User";
import { differenceInDays, isBefore } from "date-fns";
import { connectDB } from "../database";
import {
  sendDelayedShippingReminder,
  delayedReleaseMessageBuyer,
  sendSuccessfulTransaction,
  sendRefundMessageSeller,
} from "../mailing/sms";
import { getmessageInfo } from "@/app/action/TransactionAction";

/**
 * Loads escrow, user, and message info for a transaction.
 * Returns null if any required data is missing.
 */
const loadTransactionContext = async (transaction) => {
  const escrow = await Escrow.findOne({ transactionId: transaction._id });
  if (!escrow) {
    console.warn(
      `[transactions] No escrow found for transaction ${transaction._id}`,
    );
    return null;
  }

  const user = await User.findOne({ _id: transaction.sellerId });
  if (!user) {
    console.warn(
      `[transactions] No user found for seller ${transaction.sellerId}`,
    );
    return null;
  }

  const info = await getmessageInfo(transaction, user, escrow, transaction._id);
  return { escrow, user, info };
};

/**
 * Checks whether sellers have shipped within their delivery-to-dispatch (dtd) window.
 * Sends reminders at 2 days overdue, triggers a refund if the deadline has fully passed.
 */
export const checkSellerDeadline = async (transactions) => {
  await connectDB();

  for (const transaction of transactions) {
    try {
      const ctx = await loadTransactionContext(transaction);
      if (!ctx) continue;

      const { escrow, user, info } = ctx;

      if (escrow.status !== "held") continue;
      if (!escrow.heldAt) {
        console.warn(
          `[checkSellerDeadline] Missing heldAt for escrow on transaction ${transaction._id}`,
        );
        continue;
      }

      // Copy heldAt to avoid mutating the Mongoose document in memory
      const deadline = new Date(escrow.heldAt);
      deadline.setDate(deadline.getDate() + (user.dtd ?? 0));

      const now = new Date();
      const daysOverdue = differenceInDays(now, deadline);

      console.log(
        `[checkSellerDeadline] Transaction ${transaction._id} | deadline: ${deadline} | overdue by: ${daysOverdue}d`,
      );

      // Send reminder at >= 2 days overdue (once only)
      if (daysOverdue >= 2 && !transaction.sellerReminderSent) {
        await sendDelayedShippingReminder(info, "seller");
        await sendDelayedShippingReminder(info, "buyer");

        await Transaction.updateOne(
          { _id: transaction._id },
          { $set: { sellerReminderSent: true } },
        );

        console.log(
          `[checkSellerDeadline] Reminder sent for transaction ${transaction._id}`,
        );
      }

      // Refund if deadline has fully passed
      if (isBefore(deadline, now)) {
        await handleRefund(transaction._id);
        console.log(
          `[checkSellerDeadline] Refund triggered for transaction ${transaction._id}`,
        );
      }
    } catch (error) {
      console.error(
        `[checkSellerDeadline] Error processing transaction ${transaction._id}:`,
        error,
      );
    }
  }
};

/**
 * Checks whether buyers have confirmed delivery within 7 days of shipping.
 * Auto-confirms and releases escrow if the deadline has passed.
 */
export const checkBuyerDeadline = async (transactions) => {
  await connectDB();

  for (const transaction of transactions) {
    try {
      const ctx = await loadTransactionContext(transaction);
      if (!ctx) continue;

      const { escrow, info } = ctx;

      if (escrow.status !== "held") continue;

      if (!transaction.shippingDate) continue;

      // Buyer has 7 days from shipping date to confirm receipt
      const buyerDeadline = new Date(transaction.shippingDate);
      buyerDeadline.setDate(buyerDeadline.getDate() + 7);

      const now = new Date();

      console.log(
        `[checkBuyerDeadline] Transaction ${transaction._id} | buyerDeadline: ${buyerDeadline} | now: ${now}`,
      );

      if (isBefore(buyerDeadline, now) && !transaction.buyerReminderSent) {
        // Auto-confirm delivery and release escrow
        await Transaction.updateOne(
          { _id: transaction._id },
          {
            $set: {
              transactionStatus: "delivered",
              buyerReminderSent: true,
            },
          },
        );

        await Escrow.updateOne(
          { transactionId: transaction._id },
          { $set: { status: "released" } },
        );

        // Notify both parties
        await delayedReleaseMessageBuyer(info);
        await sendSuccessfulTransaction(info, "seller");

        console.log(
          `[checkBuyerDeadline] Auto-confirmed transaction ${transaction._id} — buyer deadline passed`,
        );
      }
    } catch (error) {
      console.error(
        `[checkBuyerDeadline] Error processing transaction ${transaction._id}:`,
        error,
      );
    }
  }
};

/**
 * Refunds the buyer and penalises the seller's escrow score.
 * Accepts a transactionId (ObjectId or string), not a full transaction object.
 * Idempotent — safe to call multiple times on the same transaction.
 */
export const handleRefund = async (transactionId) => {
  await connectDB();

  try {
    const transaction = await Transaction.findById(transactionId);
    const escrow = await Escrow.findOne({ transactionId });

    if (!transaction || !escrow) {
      console.warn(
        `[handleRefund] Transaction or Escrow not found for id ${transactionId}`,
      );
      return;
    }

    // Idempotency guard — already refunded
    if (
      transaction.transactionStatus === "cancelled" &&
      escrow.status === "refunded"
    ) {
      console.log(
        `[handleRefund] Transaction ${transactionId} already refunded — skipping`,
      );
      return;
    }

    // Only refund if money is still held and transaction is still active
    if (escrow.status !== "held") {
      console.warn(
        `[handleRefund] Escrow not in held state for transaction ${transactionId} — skipping`,
      );
      return;
    }

    if (!["pending", "active"].includes(transaction.transactionStatus)) {
      console.warn(
        `[handleRefund] Unexpected transaction status "${transaction.transactionStatus}" for ${transactionId} — skipping`,
      );
      return;
    }

    await Transaction.updateOne(
      { _id: transaction._id },
      { $set: { transactionStatus: "cancelled" } },
    );

    await User.updateOne(
      { _id: transaction.sellerId },
      { $inc: { escrowScore: -500 } },
    );

    await Escrow.updateOne(
      { transactionId: transaction._id },
      { $set: { status: "refunded", refundAt: new Date() } },
    );

    // Notify seller of refund
    const user = await User.findById(transaction.sellerId);
    if (user) {
      const info = await getmessageInfo(
        transaction,
        user,
        escrow,
        transaction._id,
      );
      await sendRefundMessageSeller(info);
    }

    console.log(
      `[handleRefund] Refund complete for transaction ${transactionId}`,
    );
  } catch (error) {
    console.error(
      `[handleRefund] Error refunding transaction ${transactionId}:`,
      error,
    );
  }
};

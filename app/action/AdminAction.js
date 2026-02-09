"use server";
import { updateTag } from "next/cache";
import { connectDB } from "@/lib/database";
import User from "@/lib/models/User";
import { Transaction } from "@/lib/models/Transaction";
import { Escrow } from "@/lib/models/Escrow";
import { createVerificationStatusNotification } from "@/app/action/NotificationAction";

export const getAdminStats = async () => {
  await connectDB();
  const [
    totalUsers,
    pendingUsers,
    verifiedUsers,
    totalTransactions,
    completedTransactions,
    pendingTransactions,
    totalEscrows,
    activeEscrows,
    completedEscrows,
    totalVolume,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ verification: "pending" }),
    User.countDocuments({ verification: "verified" }),
    Transaction.countDocuments(),
    Transaction.countDocuments({ transactionStatus: "delievered" }),
    Transaction.countDocuments({ transactionStatus: "pending" }),
    Escrow.countDocuments(),
    Escrow.countDocuments({ status: "held" }),
    Escrow.countDocuments({ status: "released" }),
    Transaction.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
  ]);

  return {
    totalUsers,
    pendingUsers,
    verifiedUsers,
    totalTransactions,
    completedTransactions,
    pendingTransactions,
    totalEscrows,
    activeEscrows,
    completedEscrows,
    totalVolume: totalVolume[0]?.total || 0,
  };
};

export const getAllTransactions = async () => {
  await connectDB();
  try {
    const transactions = await Transaction.find({})
      .populate("sellerId", "firstName lastName businessName email")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(transactions));
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

export const getAllEscrows = async () => {
  await connectDB();
  try {
    const escrows = await Escrow.find({})
      .populate({
        path: "transactionId",
        populate: {
          path: "sellerId",
          select: "firstName lastName businessName email",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(escrows));
  } catch (error) {
    console.error("Error fetching escrows:", error);
    return [];
  }
};

export const getTransactionsByStatus = async (status) => {
  await connectDB();
  try {
    const filter = status ? { transactionStatus: status } : {};
    const transactions = await Transaction.find(filter)
      .populate("sellerId", "firstName lastName businessName email")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(transactions));
  } catch (error) {
    console.error("Error fetching transactions by status:", error);
    return [];
  }
};

export const getEscrowsByStatus = async (status) => {
  await connectDB();
  try {
    const filter = status ? { status } : {};
    const escrows = await Escrow.find(filter)
      .populate({
        path: "transactionId",
        populate: {
          path: "sellerId",
          select: "firstName lastName businessName email",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(escrows));
  } catch (error) {
    console.error("Error fetching escrows by status:", error);
    return [];
  }
};

export const verifyUser = async (id) => {
  await connectDB();
  try {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    user.verification = "verified";
    user.professionalVerification.status = "verified";
    user.professionalVerification.verifiedAt = new Date();
    await user.save();

    // Create notification for user
    await createVerificationStatusNotification(id, true);

    updateTag("user");
    return { status: true, message: "verification complete" };
  } catch (error) {
    console.log(error);
    return { status: false, message: error.message };
  }
};

export const rejectUser = async (id, reason) => {
  await connectDB();
  try {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    user.verification = "failed";
    if (user.professionalVerification) {
      user.professionalVerification.status = "failed";
      user.professionalVerification.rejectionReason = reason;
      user.professionalVerification.verifiedAt = new Date();
    }
    await user.save();

    // Create notification for user
    await createVerificationStatusNotification(id, false);

    updateTag("user");
    return { status: true, message: "verification rejected" };
  } catch (error) {
    console.log(error);
    return { status: false, message: error.message };
  }
};

export const deleteAllUser = async (id) => {
  await connectDB();
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new Error("User not found");

    return { status: "success", message: "user successfully deleted" };
  } catch (error) {
    console.log(error);
    return { status: "error", message: "something went wrong" };
  }
};

export const releaseEscrowFunds = async (escrowId) => {
  await connectDB();
  try {
    const escrow = await Escrow.findById(escrowId).populate("transactionId");
    if (!escrow) throw new Error("Escrow not found");

    escrow.status = "released";
    escrow.releaseAt = new Date();
    await escrow.save();

    // Update transaction status
    if (escrow.transactionId) {
      await Transaction.findByIdAndUpdate(escrow.transactionId._id, {
        transactionStatus: "delievered",
      });
    }

    updateTag("escrow");
    return { status: true, message: "Funds released successfully" };
  } catch (error) {
    console.error("Error releasing escrow funds:", error);
    return { status: false, message: error.message };
  }
};

export const cancelEscrow = async (escrowId, reason) => {
  await connectDB();
  try {
    const escrow = await Escrow.findById(escrowId).populate("transactionId");
    if (!escrow) throw new Error("Escrow not found");

    escrow.status = "refunded";
    escrow.refundAt = new Date();
    await escrow.save();

    // Update transaction status
    if (escrow.transactionId) {
      await Transaction.findByIdAndUpdate(escrow.transactionId._id, {
        transactionStatus: "cancelled",
      });
    }

    updateTag("escrow");
    return { status: true, message: "Escrow cancelled and refunded" };
  } catch (error) {
    console.error("Error cancelling escrow:", error);
    return { status: false, message: error.message };
  }
};

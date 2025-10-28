import { Transaction } from "../models/Transaction.js";
import User from "../models/User.js";
export const getTransactionWithDeadline = async (userId) => {
  try {
    // 1️⃣ Find user
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // 2️⃣ Convert user's deadline-to-delivery (dtd) into milliseconds
    const dtdMs = (Number(user.dtd) || 0) * 24 * 60 * 60 * 1000;

    // 3️⃣ Run aggregation
    const transactions = await Transaction.aggregate([
      {
        $match: {
          sellerId: user._id,
          transactionStatus: "pending",
        },
      },
      {
        $lookup: {
          from: "escrows",
          localField: "_id",
          foreignField: "transactionId",
          as: "escrow",
        },
      },
      {
        $unwind: {
          path: "$escrow",
          preserveNullAndEmptyArrays: false, // exclude those without escrow
        },
      },
      {
        $addFields: {
          deadline: { $add: ["$escrow.heldAt", dtdMs] },
        },
      },
      {
        // 4️⃣ Filter only transactions whose deadlines are in the future
        $match: {
          deadline: { $gt: new Date() },
        },
      },
      {
        $sort: { deadline: 1 },
      },
      {
        $limit: 5,
      },
    ]);

    // 5️⃣ Add "daysLeft" in JS for easier formatting
    return transactions.map((t) => {
      const now = new Date();
      const deadline = new Date(t.deadline);
      const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
      return {
        ...t,
        daysLeft: Math.max(daysLeft, 0),
      };
    });
  } catch (error) {
    console.error("Error in getTransactionWithDeadline:", error);
    throw error;
  }
};

export const getRecentTransaction = async (userId) => {
  try {
    const transaction = await Transaction.find({ sellerId: userId })
      .sort({ createdAt: -1 })
      .limit(5);
    return transaction;
  } catch (error) {
    // throw new Error("Error fetching transaction: " + error.message);
  }
};

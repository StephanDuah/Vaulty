"use server";

import { connectDB } from "@/lib/database";
import { Transaction } from "@/lib/models/Transaction";
import User from "@/lib/models/User";
import Product from "@/lib/models/product";

// Commission rate (5%)
const COMMISSION_RATE = 0.05;

export async function getEarningsAnalytics() {
  await connectDB();
  try {
    console.log("Fetching earnings analytics...");

    // Get all transactions
    const transactions = await Transaction.find({}).sort({ createdAt: -1 });
    console.log(`Found ${transactions.length} transactions`);

    // Calculate total earnings from commission
    const totalTransactions = transactions.length;
    const totalTransactionVolume = transactions.reduce(
      (sum, tx) => sum + (tx.totalAmount || 0),
      0,
    );
    const totalCommission = totalTransactionVolume * COMMISSION_RATE;
    const netEarnings = totalCommission;

    console.log(`Total transaction volume: GHS ${totalTransactionVolume}`);
    console.log(`Total commission earned: GHS ${totalCommission}`);

    // Get transactions by status
    const completedTransactions = transactions.filter(
      (tx) => tx.status === "completed",
    );
    const pendingTransactions = transactions.filter(
      (tx) => tx.status === "pending",
    );
    const failedTransactions = transactions.filter(
      (tx) => tx.status === "failed",
    );

    // Calculate monthly earnings
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = transactions.filter((tx) => {
      const txDate = new Date(tx.createdAt);
      return (
        txDate.getMonth() === currentMonth &&
        txDate.getFullYear() === currentYear
      );
    });

    const monthlyEarnings = monthlyTransactions.reduce(
      (sum, tx) => sum + (tx.totalAmount || 0) * COMMISSION_RATE,
      0,
    );
    const monthlyCommission = monthlyEarnings;

    console.log(`Monthly earnings: GHS ${monthlyEarnings}`);
    console.log(`Monthly transactions: ${monthlyTransactions.length}`);

    // Calculate daily earnings (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyTransactions = transactions.filter(
      (tx) => new Date(tx.createdAt) >= thirtyDaysAgo,
    );

    const dailyEarnings = {};
    dailyTransactions.forEach((tx) => {
      const date = new Date(tx.createdAt).toISOString().split("T")[0];
      if (!dailyEarnings[date]) {
        dailyEarnings[date] = 0;
      }
      dailyEarnings[date] += (tx.totalAmount || 0) * COMMISSION_RATE;
    });

    // Top earning sellers
    const sellerEarnings = {};
    console.log("Processing transactions for seller earnings...");

    transactions.forEach((tx) => {
      console.log("Transaction:", {
        _id: tx._id,
        sellerId: tx.sellerId,
        totalAmount: tx.totalAmount,
        transactionStatus: tx.transactionStatus,
      });
      if (tx.sellerId && tx.totalAmount) {
        const sellerIdStr = tx.sellerId.toString();
        if (!sellerEarnings[sellerIdStr]) {
          sellerEarnings[sellerIdStr] = { earnings: 0, count: 0 };
        }
        sellerEarnings[sellerIdStr].earnings +=
          tx.totalAmount * COMMISSION_RATE;
        sellerEarnings[sellerIdStr].count += 1;
        console.log(
          "Added to seller earnings:",
          sellerIdStr,
          sellerEarnings[sellerIdStr],
        );
      } else {
        console.log("Skipping transaction - missing sellerId or totalAmount");
      }
    });

    console.log("Seller earnings calculated:", sellerEarnings);

    // Get seller details for top sellers
    const sellerEntries = Object.entries(sellerEarnings);
    console.log("Seller entries:", sellerEntries);

    // If no sellers, return empty array
    if (sellerEntries.length === 0) {
      return {
        totalEarnings: {
          total: netEarnings,
          commission: totalCommission,
          transactionVolume: totalTransactionVolume,
          transactionCount: totalTransactions,
          growthRate: "0.00",
        },
        monthlyEarnings: {
          current: monthlyCommission,
          transactions: monthlyTransactions.length,
          lastMonth: 0,
        },
        dailyEarnings: [],
        topSellers: [],
        transactionStats: {
          completed: completedTransactions.length,
          pending: pendingTransactions.length,
          failed: failedTransactions.length,
        },
      };
    }

    const topSellerIds = sellerEntries
      .sort(([, a], [, b]) => b.earnings - a.earnings)
      .slice(0, 5)
      .map(([sellerId]) => sellerId);

    let topEarningSellers = [];

    try {
      const topSellers = await User.find({ _id: { $in: topSellerIds } }).lean();

      topEarningSellers = topSellerIds
        .map((sellerId) => {
          const seller = topSellers.find((s) => s._id.toString() === sellerId);
          if (!seller) return null;

          return {
            seller: {
              _id: seller._id.toString(),
              firstName: seller.firstName,
              lastName: seller.lastName,
              email: seller.email,
            },
            earnings: sellerEarnings[sellerId]?.earnings || 0,
            transactions: sellerEarnings[sellerId]?.count || 0,
          };
        })
        .filter((item) => item !== null);
    } catch (userError) {
      console.error("Error fetching seller details:", userError);
      // topEarningSellers remains empty array
    }

    // Calculate growth metrics
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const lastMonthTransactions = transactions.filter((tx) => {
      const txDate = new Date(tx.createdAt);
      return (
        txDate.getMonth() === lastMonth.getMonth() &&
        txDate.getFullYear() === lastMonth.getFullYear()
      );
    });

    const lastMonthEarnings = lastMonthTransactions.reduce(
      (sum, tx) => sum + (tx.totalAmount || 0) * COMMISSION_RATE,
      0,
    );

    const growthRate =
      lastMonthEarnings > 0
        ? ((monthlyCommission - lastMonthEarnings) / lastMonthEarnings) * 100
        : 0;

    const analytics = {
      totalEarnings: {
        total: netEarnings,
        commission: totalCommission,
        transactionVolume: totalTransactionVolume,
        transactionCount: totalTransactions,
        growthRate: growthRate.toFixed(2),
      },
      monthlyEarnings: {
        current: monthlyCommission,
        transactions: monthlyTransactions.length,
        lastMonth: lastMonthEarnings,
      },
      dailyEarnings: Object.entries(dailyEarnings).map(([date, earnings]) => ({
        date,
        earnings,
        transactions: dailyTransactions.filter(
          (tx) => new Date(tx.createdAt).toISOString().split("T")[0] === date,
        ).length,
      })),
      topSellers: topEarningSellers,
      transactionStats: {
        completed: completedTransactions.length,
        pending: pendingTransactions.length,
        failed: failedTransactions.length,
      },
    };

    console.log(
      "Final analytics data:",
      JSON.stringify(topEarningSellers, null, 2),
    );

    return analytics;
  } catch (error) {
    console.error("Error fetching earnings analytics:", error);
    return {
      totalEarnings: {
        total: 0,
        commission: 0,
        transactionVolume: 0,
        transactionCount: 0,
        growthRate: 0,
      },
      monthlyEarnings: { current: 0, transactions: 0, lastMonth: 0 },
      dailyEarnings: [],
      topProducts: [],
      transactionStats: { completed: 0, pending: 0, failed: 0 },
    };
  }
}

export async function getEarningsSummary() {
  await connectDB();
  try {
    const transactions = await Transaction.find({});
    const totalVolume = transactions.reduce(
      (sum, tx) => sum + (tx.totalAmount || 0),
      0,
    );
    const totalCommission = totalVolume * COMMISSION_RATE;

    return {
      totalVolume,
      totalCommission,
      commissionRate: COMMISSION_RATE * 100,
      netEarnings: totalCommission,
    };
  } catch (error) {
    console.error("Error fetching earnings summary:", error);
    return {
      totalVolume: 0,
      totalCommission: 0,
      commissionRate: COMMISSION_RATE * 100,
      netEarnings: 0,
    };
  }
}

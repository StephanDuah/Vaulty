"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react";
import { getEarningsAnalytics } from "@/app/action/AnalyticsAction";
import EarningsChart from "@/app/component/analytics/EarningsChart";
import TopSellersTable from "@/app/component/analytics/TopSellersTable";

const EarningsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await getEarningsAnalytics();

        setAnalytics(data);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "GHS",
    }).format(amount);
  };

  const formatGrowthRate = (rate) => {
    const isPositive = parseFloat(rate) >= 0;
    return {
      value: `${Math.abs(rate)}%`,
      isPositive,
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? "text-green-600" : "text-red-600",
    };
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-600">Loading earnings data...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-600">Failed to load earnings data</p>
        </div>
      </div>
    );
  }

  const {
    totalEarnings,
    monthlyEarnings,
    dailyEarnings,
    topSellers,
    transactionStats,
  } = analytics;

  console.log("Analytics data:", analytics);
  console.log("Top sellers:", topSellers);

  const growthData = formatGrowthRate(totalEarnings.growthRate);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Earnings Analytics</h1>
        <p className="text-green-100 text-lg">
          Track company revenue and commission earnings
        </p>
        <div className="mt-6 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            <span className="text-sm">5% Commission Rate</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <span className="text-sm">
              {totalEarnings.transactionCount} Transactions
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(totalEarnings.total)}
            </p>
            <div className="flex items-center mt-2">
              <growthData.icon className="h-4 w-4 mr-1" />
              <span className={`text-sm font-medium ${growthData.color}`}>
                {growthData.value} from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Transaction Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(totalEarnings.transactionVolume)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              From {totalEarnings.transactionCount} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Monthly Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(monthlyEarnings.current)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {monthlyEarnings.transactions} transactions this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Commission Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(totalEarnings.commission)}
            </p>
            <p className="text-sm text-gray-500 mt-2">5% of total volume</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Status */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {transactionStats.completed}
                </p>
                <p className="text-sm text-gray-500">Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {transactionStats.pending}
                </p>
                <p className="text-sm text-gray-500">Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {transactionStats.failed}
                </p>
                <p className="text-sm text-gray-500">Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Earnings Chart */}
        <Card className="border-0 shadow-xl lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Daily Earnings (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EarningsChart data={dailyEarnings} />
          </CardContent>
        </Card>

        {/* Top Sellers */}
        <Card className="border-0 shadow-xl lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Top Earning Sellers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TopSellersTable
              sellers={topSellers}
              formatCurrency={formatCurrency}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EarningsPage;

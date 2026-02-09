"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, DollarSign } from "lucide-react";

const TopSellersTable = ({ sellers, formatCurrency }) => {
  const sellersData = sellers || [];

  return (
    <div className="space-y-4">
      {sellersData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p>No seller data available</p>
        </div>
      ) : (
        sellersData.map((item, index) => (
          <div
            key={item.seller?._id || index}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {item.seller?.firstName} {item.seller?.lastName}
                </p>
                <p className="text-sm text-gray-500">{item.seller?.email}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-bold text-gray-900">
                  {formatCurrency(item.earnings)}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                {item.transactions} transactions
              </Badge>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TopSellersTable;

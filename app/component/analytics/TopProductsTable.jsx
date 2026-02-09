"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, DollarSign } from "lucide-react";

const TopProductsTable = ({ products, formatCurrency }) => {
  return (
    <div className="space-y-4">
      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p>No product data available</p>
        </div>
      ) : (
        products.map((item, index) => (
          <div
            key={item.product?._id || index}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {item.product?.name || 'Unknown Product'}
                </p>
                <p className="text-sm text-gray-500">
                  {item.transactions} transactions
                </p>
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
                5% commission
              </Badge>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TopProductsTable;

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Transactions
        </h1>
        <p className="text-slate-500 mt-1">
          View and manage platform transactions
        </p>
      </div>

      <Card className="rounded-2xl border border-slate-200 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <FileText className="h-5 w-5 text-blue-500" />
            Transactions
          </CardTitle>
          <p className="text-sm text-slate-500">
            Transaction list will be available here
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
            <FileText className="h-12 w-12 mb-4 opacity-50 text-slate-300" />
            <p className="font-medium">Coming soon</p>
            <p className="text-sm mt-1">
              Transaction history and filters will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

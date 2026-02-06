import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default function EscrowsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Escrows
        </h1>
        <p className="text-slate-500 mt-1">Monitor and manage escrow deals</p>
      </div>

      <Card className="rounded-2xl border border-slate-200 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Briefcase className="h-5 w-5 text-blue-500" />
            Escrows
          </CardTitle>
          <p className="text-sm text-slate-500">
            Active and completed escrow deals
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
            <Briefcase className="h-12 w-12 mb-4 opacity-50 text-slate-300" />
            <p className="font-medium">Coming soon</p>
            <p className="text-sm mt-1">
              Escrow list and status filters will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Package,
  Calendar,
  Users,
  Lock,
  Unlock,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Lock,
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  released: {
    label: "Released",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: Unlock,
  },
  disputed: {
    label: "Disputed",
    className: "bg-orange-100 text-orange-800 border-orange-200",
    icon: AlertTriangle,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
};

// Mock escrow data
const mockEscrows = [
  {
    _id: "1",
    escrowId: "ESC001",
    transactionId: "TXN001",
    buyerName: "John Doe",
    sellerName: "Jane Smith",
    amount: 1500,
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
    product: "MacBook Pro 16\"",
    releaseDate: "2024-01-25T10:30:00Z",
    daysLeft: 3,
    disputeReason: null,
  },
  {
    _id: "2",
    escrowId: "ESC002",
    transactionId: "TXN002",
    buyerName: "Alice Johnson",
    sellerName: "Bob Wilson",
    amount: 750,
    status: "completed",
    createdAt: "2024-01-10T14:20:00Z",
    product: "iPhone 15 Pro",
    releaseDate: "2024-01-20T14:20:00Z",
    daysLeft: 0,
    disputeReason: null,
  },
  {
    _id: "3",
    escrowId: "ESC003",
    transactionId: "TXN003",
    buyerName: "Charlie Brown",
    sellerName: "Diana Prince",
    amount: 2200,
    status: "disputed",
    createdAt: "2024-01-17T09:15:00Z",
    product: "Sony A7IV Camera",
    releaseDate: "2024-01-27T09:15:00Z",
    daysLeft: 5,
    disputeReason: "Product not as described",
  },
  {
    _id: "4",
    escrowId: "ESC004",
    transactionId: "TXN004",
    buyerName: "Eve Davis",
    sellerName: "Frank Miller",
    amount: 500,
    status: "released",
    createdAt: "2024-01-05T16:45:00Z",
    product: "iPad Air",
    releaseDate: "2024-01-15T16:45:00Z",
    daysLeft: 0,
    disputeReason: null,
  },
];

export default function EscrowsTable() {
  const [escrows] = useState(mockEscrows);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredEscrows = escrows.filter((escrow) => {
    const matchesSearch =
      escrow.escrowId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      escrow.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      escrow.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      escrow.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      escrow.product.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || escrow.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalEscrows = escrows.length;
  const activeEscrows = escrows.filter(e => e.status === "active").length;
  const completedEscrows = escrows.filter(e => e.status === "completed" || e.status === "released").length;
  const disputedEscrows = escrows.filter(e => e.status === "disputed").length;
  const totalValue = escrows.reduce((sum, e) => sum + e.amount, 0);

  const statsCards = [
    {
      title: "Total Escrows",
      value: totalEscrows,
      icon: Shield,
      color: "from-blue-500 to-blue-600",
      change: "+18.2%",
      trend: "up",
    },
    {
      title: "Active",
      value: activeEscrows,
      icon: Lock,
      color: "from-blue-500 to-indigo-600",
      change: "+5.3%",
      trend: "up",
    },
    {
      title: "Completed",
      value: completedEscrows,
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      change: "+12.1%",
      trend: "up",
    },
    {
      title: "Total Value",
      value: `GHS ${totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
      change: "+22.7%",
      trend: "up",
    },
  ];

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800 border-gray-200",
      icon: AlertTriangle,
    };
    const Icon = config.icon;
    return (
      <Badge
        variant="outline"
        className={cn(
          "font-medium capitalize border flex items-center gap-1",
          config.className,
        )}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getDaysLeftBadge = (daysLeft, status) => {
    if (status === "completed" || status === "released" || status === "cancelled") {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
          Completed
        </Badge>
      );
    }
    
    if (daysLeft <= 1) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
          {daysLeft} day left
        </Badge>
      );
    } else if (daysLeft <= 3) {
      return (
        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
          {daysLeft} days left
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          {daysLeft} days left
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Card */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-800">
                Escrow Management
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Monitor and manage all escrow transactions
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full lg:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search escrows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 rounded-xl border-gray-200 bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20"
                />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      {statusFilter === "all" ? "All Status" : statusFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                      All Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                      Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("released")}>
                      Released
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("disputed")}>
                      Disputed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>
                      Cancelled
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200">
                    <TableHead className="h-14 px-6 font-bold text-gray-800 uppercase tracking-wider text-sm">
                      Escrow ID
                    </TableHead>
                    <TableHead className="h-14 px-6 font-bold text-gray-800 uppercase tracking-wider text-sm">
                      Parties
                    </TableHead>
                    <TableHead className="h-14 px-6 font-bold text-gray-800 uppercase tracking-wider text-sm">
                      Product
                    </TableHead>
                    <TableHead className="h-14 px-6 font-bold text-gray-800 uppercase tracking-wider text-sm">
                      Amount
                    </TableHead>
                    <TableHead className="h-14 px-6 font-bold text-gray-800 uppercase tracking-wider text-sm">
                      Status
                    </TableHead>
                    <TableHead className="h-14 px-6 font-bold text-gray-800 uppercase tracking-wider text-sm">
                      Time Left
                    </TableHead>
                    <TableHead className="h-14 px-6 font-bold text-gray-800 uppercase tracking-wider text-sm text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEscrows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-64 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-gray-100 rounded-full">
                            <Shield className="h-12 w-12 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-xl font-semibold text-gray-700">
                              No escrows found
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Try adjusting your search or filters
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEscrows.map((escrow) => (
                      <TableRow
                        key={escrow._id}
                        className="border-b border-gray-100 transition-all duration-200 hover:bg-blue-50 hover:shadow-sm"
                      >
                        <TableCell className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="font-semibold text-gray-900">
                              {escrow.escrowId}
                            </div>
                            <div className="text-xs text-gray-500">
                              {escrow.transactionId}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-600">B</span>
                              </div>
                              <span className="text-sm font-medium">
                                {escrow.buyerName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-green-600">S</span>
                              </div>
                              <span className="text-sm font-medium">
                                {escrow.sellerName}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {escrow.product}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="font-semibold text-gray-900">
                            GHS {escrow.amount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="space-y-2">
                            {getStatusBadge(escrow.status)}
                            {escrow.disputeReason && (
                              <div className="text-xs text-red-600 max-w-xs truncate">
                                {escrow.disputeReason}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {getDaysLeftBadge(escrow.daysLeft, escrow.status)}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-9 gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-9 w-9"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                {escrow.status === "active" && (
                                  <>
                                    <DropdownMenuItem>
                                      <Unlock className="h-4 w-4 mr-2" />
                                      Release Funds
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Cancel Escrow
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {escrow.status === "disputed" && (
                                  <DropdownMenuItem>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Resolve Dispute
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download Report
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

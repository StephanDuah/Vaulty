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
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  failed: {
    label: "Failed",
    className: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
  disputed: {
    label: "Disputed",
    className: "bg-orange-100 text-orange-800 border-orange-200",
    icon: AlertCircle,
  },
};

// Mock transaction data
const mockTransactions = [
  {
    _id: "1",
    transactionId: "TXN001",
    buyerName: "John Doe",
    sellerName: "Jane Smith",
    amount: 1500,
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z",
    product: "MacBook Pro 16\"",
    type: "product",
  },
  {
    _id: "2",
    transactionId: "TXN002",
    buyerName: "Alice Johnson",
    sellerName: "Bob Wilson",
    amount: 750,
    status: "pending",
    createdAt: "2024-01-16T14:20:00Z",
    product: "iPhone 15 Pro",
    type: "product",
  },
  {
    _id: "3",
    transactionId: "TXN003",
    buyerName: "Charlie Brown",
    sellerName: "Diana Prince",
    amount: 2200,
    status: "disputed",
    createdAt: "2024-01-17T09:15:00Z",
    product: "Sony A7IV Camera",
    type: "product",
  },
  {
    _id: "4",
    transactionId: "TXN004",
    buyerName: "Eve Davis",
    sellerName: "Frank Miller",
    amount: 500,
    status: "failed",
    createdAt: "2024-01-18T16:45:00Z",
    product: "iPad Air",
    type: "product",
  },
];

export default function TransactionsTable() {
  const [transactions] = useState(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.product.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(t => t.status === "completed").length;
  const pendingTransactions = transactions.filter(t => t.status === "pending").length;
  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);

  const statsCards = [
    {
      title: "Total Transactions",
      value: totalTransactions,
      icon: DollarSign,
      color: "from-blue-500 to-blue-600",
      change: "+12.5%",
      trend: "up",
    },
    {
      title: "Completed",
      value: completedTransactions,
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      change: "+8.2%",
      trend: "up",
    },
    {
      title: "Pending",
      value: pendingTransactions,
      icon: Clock,
      color: "from-yellow-500 to-orange-600",
      change: "+3.1%",
      trend: "up",
    },
    {
      title: "Total Volume",
      value: `GHS ${totalVolume.toLocaleString()}`,
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      change: "+15.3%",
      trend: "up",
    },
  ];

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800 border-gray-200",
      icon: AlertCircle,
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
                Transaction Management
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Monitor and manage all platform transactions
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full lg:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
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
                    <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                      Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("failed")}>
                      Failed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("disputed")}>
                      Disputed
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
                      Transaction ID
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
                      Date
                    </TableHead>
                    <TableHead className="h-14 px-6 font-bold text-gray-800 uppercase tracking-wider text-sm text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-64 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-gray-100 rounded-full">
                            <DollarSign className="h-12 w-12 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-xl font-semibold text-gray-700">
                              No transactions found
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Try adjusting your search or filters
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow
                        key={transaction._id}
                        className="border-b border-gray-100 transition-all duration-200 hover:bg-blue-50 hover:shadow-sm"
                      >
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {transaction.transactionId}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {transaction.type}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <ArrowDownRight className="h-3 w-3 text-red-500" />
                              <span className="text-sm font-medium">
                                {transaction.buyerName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ArrowUpRight className="h-3 w-3 text-green-500" />
                              <span className="text-sm font-medium">
                                {transaction.sellerName}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="text-sm text-gray-700">
                            {transaction.product}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="font-semibold text-gray-900">
                            GHS {transaction.amount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">
                              {new Date(transaction.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
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
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download Receipt
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

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  getAllEscrows,
  getEscrowsByStatus,
  releaseEscrowFunds,
  cancelEscrow,
} from "@/app/action/AdminAction";

const statusConfig = {
  held: {
    label: "Active",
    className: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Lock,
  },
  released: {
    label: "Released",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: Unlock,
  },
  refunded: {
    label: "Refunded",
    className: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
};

export default function EscrowsTable() {
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchEscrows = async () => {
      setLoading(true);
      try {
        const data = await getEscrowsByStatus(
          statusFilter === "all" ? null : statusFilter,
        );
        setEscrows(data);
      } catch (error) {
        console.error("Error fetching escrows:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEscrows();
  }, [statusFilter]);

  const filteredEscrows = escrows.filter((escrow) => {
    const matchesSearch =
      escrow._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      escrow.transactionId?._id
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      escrow.transactionId?.sellerId?.businessName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      escrow.transactionId?.items?.some((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    return matchesSearch;
  });

  // Calculate statistics from real data
  const totalEscrows = escrows.length;
  const activeEscrows = escrows.filter((e) => e.status === "held").length;
  const completedEscrows = escrows.filter(
    (e) => e.status === "released",
  ).length;
  const totalValue = escrows.reduce(
    (sum, e) => sum + (e.transactionId?.totalAmount || 0),
    0,
  );

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

  const getDaysLeft = (heldAt) => {
    if (!heldAt) return 0;
    const daysDiff = Math.ceil(
      (Date.now() - new Date(heldAt).getTime()) / (1000 * 60 * 60 * 24),
    );
    return Math.max(0, 30 - daysDiff); // Assuming 30-day escrow period
  };

  const getDaysLeftBadge = (daysLeft, status) => {
    if (status === "released" || status === "refunded") {
      return (
        <Badge
          variant="outline"
          className="bg-gray-100 text-gray-800 border-gray-200"
        >
          Completed
        </Badge>
      );
    }

    if (daysLeft <= 1) {
      return (
        <Badge
          variant="outline"
          className="bg-red-100 text-red-800 border-red-200"
        >
          {daysLeft} day left
        </Badge>
      );
    } else if (daysLeft <= 3) {
      return (
        <Badge
          variant="outline"
          className="bg-orange-100 text-orange-800 border-orange-200"
        >
          {daysLeft} days left
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 border-green-200"
        >
          {daysLeft} days left
        </Badge>
      );
    }
  };

  const handleReleaseFunds = async (escrowId) => {
    try {
      const result = await releaseEscrowFunds(escrowId);
      if (result.status) {
        // Refresh the escrows list
        const data = await getEscrowsByStatus(
          statusFilter === "all" ? null : statusFilter,
        );
        setEscrows(data);
      }
    } catch (error) {
      console.error("Error releasing funds:", error);
    }
  };

  const handleCancelEscrow = async (escrowId) => {
    try {
      const result = await cancelEscrow(escrowId);
      if (result.status) {
        // Refresh the escrows list
        const data = await getEscrowsByStatus(
          statusFilter === "all" ? null : statusFilter,
        );
        setEscrows(data);
      }
    } catch (error) {
      console.error("Error cancelling escrow:", error);
    }
  };

  const getProductName = (items) => {
    if (!items || items.length === 0) return "No items";
    return items.length === 1
      ? items[0].name
      : `${items[0].name} +${items.length - 1} more`;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading escrows...</p>
          </div>
        </div>
      </div>
    );
  }

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
                    <DropdownMenuItem onClick={() => setStatusFilter("held")}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter("released")}
                    >
                      Released
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter("refunded")}
                    >
                      Refunded
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
                    filteredEscrows.map((escrow) => {
                      const daysLeft = getDaysLeft(escrow.heldAt);
                      return (
                        <TableRow
                          key={escrow._id}
                          className="border-b border-gray-100 transition-all duration-200 hover:bg-blue-50 hover:shadow-sm"
                        >
                          <TableCell className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="font-semibold text-gray-900">
                                {escrow._id?.slice(-8) || "N/A"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {escrow.transactionId?._id?.slice(-8) || "N/A"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-blue-600">
                                    B
                                  </span>
                                </div>
                                <span className="text-sm font-medium">
                                  {escrow.transactionId?.buyerDetail?.firstName}{" "}
                                  {escrow.transactionId?.buyerDetail?.lastName}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-green-600">
                                    S
                                  </span>
                                </div>
                                <span className="text-sm font-medium">
                                  {escrow.transactionId?.sellerId
                                    ?.businessName || "Unknown Seller"}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700">
                                {getProductName(escrow.transactionId?.items)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <span className="font-semibold text-gray-900">
                              GHS{" "}
                              {(
                                escrow.transactionId?.totalAmount || 0
                              ).toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="space-y-2">
                              {getStatusBadge(escrow.status)}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            {getDaysLeftBadge(daysLeft, escrow.status)}
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
                                  {escrow.status === "held" && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleReleaseFunds(escrow._id)
                                        }
                                      >
                                        <Unlock className="h-4 w-4 mr-2" />
                                        Release Funds
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleCancelEscrow(escrow._id)
                                        }
                                      >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Cancel Escrow
                                      </DropdownMenuItem>
                                    </>
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
                      );
                    })
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

"use client";
import { useRouter } from "next/navigation";
import {
  Package2,
  Bell,
  User,
  LogOut,
  DollarSign,
  BarChartIcon,
  Settings,
  HelpCircle,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  Shield,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/auth";

const transactions = [
  {
    id: "TX001",
    buyer: "John Doe",
    amount: 500,
    status: "Pending",
    date: "2025-02-14",
    product: "Premium Widget",
  },
  {
    id: "TX002",
    buyer: "Jane Smith",
    amount: 750,
    status: "In Escrow",
    date: "2025-02-13",
    product: "Deluxe Gadget",
  },
  {
    id: "TX003",
    buyer: "Bob Johnson",
    amount: 1000,
    status: "Completed",
    date: "2025-02-12",
    product: "Ultimate Package",
  },
  {
    id: "TX004",
    buyer: "Alice Brown",
    amount: 250,
    status: "Disputed",
    date: "2025-02-11",
    product: "Basic Service",
  },
  {
    id: "TX005",
    buyer: "Charlie Wilson",
    amount: 1500,
    status: "In Escrow",
    date: "2025-02-10",
    product: "Premium Consultation",
  },
];

const monthlyData = [
  { name: "Jan", Total: 4000 },
  { name: "Feb", Total: 3000 },
  { name: "Mar", Total: 5000 },
  { name: "Apr", Total: 4500 },
  { name: "May", Total: 6000 },
  { name: "Jun", Total: 5500 },
];

const statusData = [
  { name: "Pending", value: 5, color: "#f59e0b" },
  { name: "In Escrow", value: 10, color: "#3b82f6" },
  { name: "Completed", value: 15, color: "#10b981" },
  { name: "Disputed", value: 2, color: "#ef4444" },
];

const productData = [
  { name: "Premium Widget", Total: 1200 },
  { name: "Deluxe Gadget", Total: 1500 },
  { name: "Ultimate Package", Total: 2000 },
  { name: "Basic Service", Total: 800 },
  { name: "Premium Consultation", Total: 2500 },
];

export default function Dashboard() {
  const router = useRouter();

  const viewTransaction = (transactionId) => {
    router.push(`/dashboard/transaction/${transactionId}`);
  };

  const statsCards = [
    {
      title: "Total Escrow",
      value: "$12,450",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Active Deals",
      value: "23",
      change: "+8.2%",
      trend: "up",
      icon: Shield,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Success Rate",
      value: "98.5%",
      change: "+2.1%",
      trend: "up",
      icon: Activity,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Total Users",
      value: "1,234",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl border-r border-gray-200">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
          <h2 className="text-2xl font-bold flex items-center text-white">
            <Package2 className="mr-3" />
            TrustVault
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            Professional Escrow Services
          </p>
        </div>
        <nav className="mt-6">
          <a
            href="#"
            className="flex py-3 px-6 bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-medium hover:bg-blue-100 items-center transition-colors"
          >
            <DollarSign className="mr-3" /> Transactions
          </a>
          <a
            href="#"
            className="flex py-3 px-6 text-gray-600 hover:bg-gray-50 items-center transition-colors"
          >
            <BarChartIcon className="mr-3" /> Analytics
          </a>
          <a
            href="#"
            className="flex py-3 px-6 text-gray-600 hover:bg-gray-50 items-center transition-colors"
          >
            <User className="mr-3" /> Profile
          </a>
          <a
            href="#"
            className="flex py-3 px-6 text-gray-600 hover:bg-gray-50 items-center transition-colors"
          >
            <Settings className="mr-3" /> Settings
          </a>
          <a
            href="#"
            className="flex py-3 px-6 text-gray-600 hover:bg-gray-50 items-center transition-colors"
          >
            <HelpCircle className="mr-3" /> Support
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Seller Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your escrow transactions efficiently
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    John Smith
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
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
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="flex items-center mt-2">
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card className="col-span-2 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Monthly Escrow Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChartIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">
                      Chart visualization coming soon
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                      {monthlyData.map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="font-medium text-gray-600">
                            {item.name}
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            ${item.Total}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Transaction Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">
                      Chart visualization coming soon
                    </p>
                    <div className="mt-4 space-y-2">
                      {statusData.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-gray-600">{item.name}</span>
                          </div>
                          <span className="font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products Chart */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Top Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChartIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">
                    Chart visualization coming soon
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    {productData.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-medium">${item.Total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border-0">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <h2 className="text-xl font-semibold text-gray-800">
                Recent Transactions
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Your latest escrow activities
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">
                    Transaction ID
                  </TableHead>
                  <TableHead className="font-semibold">Buyer</TableHead>
                  <TableHead className="font-semibold">Product</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <span className="text-blue-600 font-semibold">
                        {transaction.id}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.buyer}
                    </TableCell>
                    <TableCell>{transaction.product}</TableCell>
                    <TableCell className="font-semibold">
                      ${transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`
                          ${transaction.status === "Completed" ? "bg-green-100 text-green-800 border-green-200" : ""}
                          ${transaction.status === "Disputed" ? "bg-red-100 text-red-800 border-red-200" : ""}
                          ${transaction.status === "In Escrow" ? "bg-blue-100 text-blue-800 border-blue-200" : ""}
                          ${transaction.status === "Pending" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : ""}
                        `}
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => viewTransaction(transaction.id)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-8">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <p className="text-center text-sm text-gray-500">
                © 2025 TrustVault, Inc. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

DisplayTransactions(5);

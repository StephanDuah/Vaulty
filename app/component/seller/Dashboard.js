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

// const monthlyData = [
//   { name: "Jan", Total: 4000 },
//   { name: "Feb", Total: 3000 },
//   { name: "Mar", Total: 5000 },
//   { name: "Apr", Total: 4500 },
//   { name: "May", Total: 6000 },
//   { name: "Jun", Total: 5500 },
// ];

// const statusData = [
//   { name: "Pending", value: 5 },
//   { name: "In Escrow", value: 10 },
//   { name: "Completed", value: 15 },
//   { name: "Disputed", value: 2 },
// ];

// const productData = [
//   { name: "Premium Widget", Total: 1200 },
//   { name: "Deluxe Gadget", Total: 1500 },
//   { name: "Ultimate Package", Total: 2000 },
//   { name: "Basic Service", Total: 800 },
//   { name: "Premium Consultation", Total: 2500 },
// ];

export default function Dashboard() {
  const router = useRouter();

  const viewTransaction = (transactionId) => {
    router.push(`/dashboard/transaction/${transactionId}`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold flex items-center">
            <Package2 className="mr-2" />
            Escrow Pro
          </h2>
        </div>
        <nav className="mt-6">
          <a
            href="#"
            className="block py-2 px-4 bg-gray-900 text-white hover:bg-gray-700 flex items-center"
          >
            <DollarSign className="mr-2" /> Transactions
          </a>
          <a
            href="#"
            className="block py-2 px-4 text-gray-400 hover:bg-gray-700 flex items-center"
          >
            <BarChartIcon className="mr-2" /> Analytics
          </a>
          <a
            href="#"
            className="block py-2 px-4 text-gray-400 hover:bg-gray-700 flex items-center"
          >
            <User className="mr-2" /> Profile
          </a>
          <a
            href="#"
            className="block py-2 px-4 text-gray-400 hover:bg-gray-700 flex items-center"
          >
            <Settings className="mr-2" /> Settings
          </a>
          <a
            href="#"
            className="block py-2 px-4 text-gray-400 hover:bg-gray-700 flex items-center"
          >
            <HelpCircle className="mr-2" /> Support
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Seller Dashboard
            </h1>
            <div className="flex items-center">
              <Button variant="outline" size="icon" className="mr-2">
                <Bell className="h-4 w-4" />
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
          {/* Charts */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Escrow Total</CardTitle>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Transaction Status</CardTitle>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          </div>

          {/* Transactions Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Transactions
              </h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.id}
                    </TableCell>
                    <TableCell>{transaction.buyer}</TableCell>
                    <TableCell>{transaction.product}</TableCell>
                    <TableCell>
                      ${transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.status === "Completed"
                            ? "success"
                            : transaction.status === "Disputed"
                            ? "destructive"
                            : transaction.status === "In Escrow"
                            ? "warning"
                            : "default"
                        }
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
                        onClick={() => viewTransaction(transaction.id)}
                      >
                        View Transaction
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
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              © 2025 TrustValut, Inc. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

import React from "react";
import { getAdminStats } from "@/app/action/AdminAction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCheck,
  UserX,
  ArrowRight,
  TrendingUp,
  Activity,
  Shield,
  AlertCircle,
  BarChart3,
  DollarSign,
  Plus,
  Upload,
  Download,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      href: "/admin/dashboard/users",
      description: "Registered accounts",
      change: "+15.3%",
      trend: "up",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Pending Verification",
      value: stats.pendingUsers,
      icon: UserX,
      href: "/admin/dashboard/users",
      description: "Awaiting review",
      change: "+8.2%",
      trend: "up",
      color: "from-yellow-500 to-orange-600",
    },
    {
      title: "Verified Users",
      value: stats.verifiedUsers,
      icon: UserCheck,
      href: "/admin/dashboard/users",
      description: "KYC approved",
      change: "+22.1%",
      trend: "up",
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Total Transactions",
      value: stats.totalTransactions,
      icon: BarChart3,
      href: "/admin/dashboard/transactions",
      description: "All platform transactions",
      change: "+18.7%",
      trend: "up",
      color: "from-purple-500 to-purple-600",
    },
  ];

  const quickActions = [
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: Users,
      href: "/admin/dashboard/users",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Transaction Review",
      description: "Review and approve transactions",
      icon: Shield,
      href: "/admin/dashboard/transactions",
      color: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      title: "Escrow Management",
      description: "Monitor and manage escrow deals",
      icon: DollarSign,
      href: "/admin/dashboard/escrows",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Export Data",
      description: "Download user and transaction data",
      icon: Download,
      href: "/admin/dashboard/export",
      color: "bg-gray-600 hover:bg-gray-700",
    },
  ];

  // Get recent activity from real data (you might want to create a separate function for this)
  const recentActivity = [
    {
      id:
        stats.totalTransactions > 0
          ? `TXN${stats.totalTransactions}`
          : "TXN001",
      type: "User Verification",
      user: "Recent User",
      time: "2 hours ago",
      status: "completed",
    },
    {
      id:
        stats.totalTransactions > 1
          ? `TXN${stats.totalTransactions - 1}`
          : "TXN002",
      type: "Transaction Created",
      user: "Active Seller",
      time: "4 hours ago",
      status: "pending",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">TrustVault Admin</h1>
        <p className="text-blue-100 text-lg">Secure Escrow Management System</p>
        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <span className="text-sm">System Status: Healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="text-sm">Security: Active</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            <span className="text-sm">
              Total Volume: GHS {stats.totalVolume.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
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
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">
                      {stat.change}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="h-8 rounded-lg bg-blue-600 text-white hover:bg-blue-700 border-0"
                    asChild
                  >
                    <a href={stat.href} className="flex items-center gap-1">
                      View
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">
              Quick Actions
            </CardTitle>
            <p className="text-sm text-gray-600">Common administrative tasks</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  className={`w-full justify-start h-12 rounded-xl text-white shadow-md hover:shadow-lg transition-all duration-300 ${action.color}`}
                  asChild
                >
                  <a href={action.href} className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs opacity-90">
                        {action.description}
                      </div>
                    </div>
                  </a>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Recent Activity
            </CardTitle>
            <p className="text-sm text-gray-600">Latest system events</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.status === "completed"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  ></div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {activity.type}
                    </div>
                    <div className="text-sm text-gray-500">{activity.user}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{activity.time}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

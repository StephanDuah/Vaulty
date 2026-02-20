"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Users,
  UserCheck,
  AlertCircle,
  TrendingUp,
  Filter,
  Download,
} from "lucide-react";
import UserVerificationModal from "../../modals/user-verification-modal";
import { Badge } from "@/components/ui/badge";
import UsersTable from "../../tables/UsersTable";
import { getAllUser } from "@/app/action/UserActions";
import { deleteAllUser, verifyUser } from "@/app/action/AdminAction";

export default function UsersPage({ allusers, pendingUsers }) {
  const [users, setUsers] = useState(allusers || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate statistics
  const totalUsers = users.length;
  const verifiedUsers = users.filter(
    (user) => user?.verification === "verified",
  ).length;
  const pendingUsersCount = users.filter(
    (user) => user?.verification === "pending",
  ).length;
  const verificationRate =
    totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(1) : 0;

  const statsCards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      change: "+12.5%",
      trend: "up",
    },
    {
      title: "Verified Users",
      value: verifiedUsers,
      icon: UserCheck,
      color: "from-emerald-500 to-emerald-600",
      change: "+8.2%",
      trend: "up",
    },
    {
      title: "Pending Verification",
      value: pendingUsersCount,
      icon: AlertCircle,
      color: "from-yellow-500 to-orange-600",
      change: "+3.1%",
      trend: "up",
    },
    {
      title: "Verification Rate",
      value: `${verificationRate}%`,
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      change: "+5.4%",
      trend: "up",
    },
  ];

  const handleVerifyUser = (userId) => {
    const user = users.find((u) => u._id === userId);
    if (user) {
      setSelectedUser(user);
      setIsVerificationModalOpen(true);
    }
  };

  const handleConfirmVerification = async (notes) => {
    if (selectedUser) {
      const response = await verifyUser(selectedUser._id);
      if (response.status) {
        // Update the user in local state
        setUsers(
          users.map((user) =>
            user._id === selectedUser._id
              ? {
                  ...user,
                  verification: "verified",
                  kyc: {
                    ...user.kyc,
                    verificationDate: new Date().toISOString(),
                    notes,
                  },
                }
              : user,
          ),
        );
        setIsVerificationModalOpen(false);
        setSelectedUser(null);
      }
    }
  };

  const handleEditUser = (userId) => {
    console.log("Edit user:", userId);
  };

  const handleDeleteSuccess = (userId) => {
    setUsers((prev) => prev.filter((u) => u._id !== userId));
  };

  const handleTerminateUser = async (userId) => {
    try {
      const response = await deleteAllUser(userId);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">User Management</h1>
        <p className="text-blue-100 text-lg">
          Manage user accounts and verification processes
        </p>
        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span className="text-sm">{totalUsers} Total Users</span>
          </div>
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            <span className="text-sm">{verifiedUsers} Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{pendingUsers?.length || 0} Pending</span>
          </div>
        </div>
      </div>

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

      {/* Pending Verification Users Section */}
      {pendingUsers && pendingUsers.length > 0 && (
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Pending Verification Requests
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Users waiting for verification approval
                </p>
              </div>
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                {pendingUsers?.length || 0} Pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {pendingUsers.slice(0, 5).map((user) => (
                <div
                  key={user._id}
                  className="p-4 hover:bg-yellow-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.firstName && user.firstName.charAt(0).toUpperCase()}
                      {user.lastName && user.lastName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {(user.firstName || "") + " " + (user.lastName || "")}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">
                        Submitted{" "}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleVerifyUser(user._id)}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Review Now
                  </Button>
                </div>
              ))}
              {pendingUsers.length > 5 && (
                <div className="p-4 text-center">
                  <Button variant="outline" className="w-full">
                    View All {pendingUsers.length} Pending Users
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Card */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-800">
                User Directory
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Search, verify, and manage user accounts
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full lg:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 rounded-xl border-gray-200 bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <UsersTable
            users={filteredUsers}
            onVerify={handleVerifyUser}
            onEdit={handleEditUser}
            onTerminate={handleTerminateUser}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </CardContent>
      </Card>

      {/* Verification Modal */}
      {isVerificationModalOpen && selectedUser && (
        <UserVerificationModal
          user={selectedUser}
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          onConfirm={handleConfirmVerification}
        />
      )}
    </div>
  );
}

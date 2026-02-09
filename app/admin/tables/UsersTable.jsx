"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  UserCheck,
  Shield,
  Calendar,
  Mail,
  AlertCircle,
  Eye,
  FileText,
  Download,
  Clock,
  MapPin,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { deleteAllUser } from "@/app/action/AdminAction";
import { cn } from "@/lib/utils";
import UserVerificationModal from "../modals/user-verification-modal";

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: AlertCircle,
  },
  verified: {
    label: "Verified",
    className: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  verification: {
    label: "In Review",
    className: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Shield,
  },
  failed: {
    label: "Failed",
    className: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
};

export default function UsersTable({
  users,
  onVerify,
  onEdit,
  onDeleteSuccess,
}) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDelete = async () => {
    const userIdToDelete = selectedUserId;
    if (!userIdToDelete) return;

    setConfirmDialogOpen(false);
    setSelectedUserId(null);
    onDeleteSuccess?.(userIdToDelete);

    try {
      setIsDeleting(true);
      await deleteAllUser(userIdToDelete);
    } finally {
      setIsDeleting(false);
    }
  };

  const openVerificationModal = (user) => {
    setSelectedUser(user);
    setVerificationModalOpen(true);
  };

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
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200">
              <TableHead className="h-14 px-6 font-bold text-gray-800 uppercase tracking-wider text-sm">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  User
                </div>
              </TableHead>
              <TableHead className="h-14 px-6 font-bold text-gray-800 uppercase tracking-wider text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
              </TableHead>
              <TableHead className="h-14 px-6 font-bold text-gray-800 uppercase tracking-wider text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Status
                </div>
              </TableHead>
              <TableHead className="h-14 px-6 font-bold text-gray-800 uppercase tracking-wider text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Verified
                </div>
              </TableHead>
              <TableHead className="h-14 px-6 font-bold text-gray-800 uppercase tracking-wider text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Joined
                </div>
              </TableHead>
              <TableHead className="h-14 px-6 font-bold text-gray-800 uppercase tracking-wider text-sm text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-64 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-gray-100 rounded-full">
                      <UserCheck className="h-12 w-12 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-gray-700">
                        No users found
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Try adjusting your search or check back later
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow
                  key={user._id}
                  className="border-b border-gray-100 transition-all duration-200 hover:bg-blue-50 hover:shadow-sm"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.firstName?.charAt(0).toUpperCase()}
                        {user.lastName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {[user.firstName, user.lastName]
                            .filter(Boolean)
                            .join(" ")}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {user._id.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {getStatusBadge(user.verification)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {user.verification === "verified" ? (
                      <div className="flex items-center gap-2 text-green-600 font-medium">
                        <CheckCircle className="h-5 w-5" />
                        <span>Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <XCircle className="h-5 w-5" />
                        <span>Pending</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {user.verification === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => openVerificationModal(user)}
                          className="h-9 gap-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Eye className="h-4 w-4" />
                          Review Documents
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onEdit(user._id)}
                        className="h-9 w-9 rounded-lg border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                        aria-label="Edit user"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setConfirmDialogOpen(true);
                          setSelectedUserId(user._id);
                        }}
                        className="h-9 w-9 rounded-lg border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                        aria-label="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Delete User Account
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete this user account? This action
              cannot be undone and all associated data will be permanently
              removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 sm:gap-0">
            <Button
              variant="outline"
              className="rounded-xl border-gray-300 hover:bg-gray-50"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Real Verification Modal */}
      {verificationModalOpen && selectedUser && (
        <UserVerificationModal
          user={selectedUser}
          isOpen={verificationModalOpen}
          onClose={() => {
            setVerificationModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}

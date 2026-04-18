"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  User,
  Calendar,
  Mail,
  MapPin,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getPendingProfessionalVerificationUsers,
  verifyUser,
  rejectUser,
} from "@/app/action/AdminAction";

export default function AdminVerificationDashboard() {
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingVerifications = async () => {
      try {
        const users = await getPendingProfessionalVerificationUsers();

        // Transform the data to match the expected format
        const transformedData = users.map((user) => ({
          id: user._id,
          userId: user._id,
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          documentType:
            user.professionalVerification?.profession ||
            "Professional Verification",
          documentNumber: user.professionalVerification?.licenseNumber || "N/A",
          submittedDate:
            user.professionalVerification?.submittedAt || user.createdAt,
          status: user.professionalVerification?.status || "Pending",
          documents: user.professionalVerification?.documents || [],
          userInfo: {
            fullName: `${user.firstName} ${user.lastName}`,
            businessName: user.professionalVerification?.businessName || "",
            profession: user.professionalVerification?.profession || "",
            experience: user.professionalVerification?.experience || "",
          },
        }));

        setPendingVerifications(transformedData);
      } catch (error) {
        console.error("Failed to fetch pending verifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingVerifications();
  }, []);

  const recentVerifications = []; // TODO: Implement recent verifications fetch

  const getStatusBadge = (status) => {
    const configs = {
      pending: {
        variant: "secondary",
        icon: Clock,
        label: "Pending Review",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      approved: {
        variant: "default",
        icon: CheckCircle,
        label: "Approved",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      rejected: {
        variant: "destructive",
        icon: XCircle,
        label: "Rejected",
        className: "bg-red-100 text-red-800 border-red-200",
      },
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const handleVerificationAction = async (
    verificationId,
    action,
    reason = "",
  ) => {
    try {
      let result;

      if (action === "approved") {
        result = await verifyUser(verificationId);
      } else if (action === "rejected") {
        result = await rejectUser(verificationId, reason);
      }

      if (result?.status) {
        setShowDocumentDialog(false);
        setSelectedVerification(null);

        // Refresh the pending verifications list
        const users = await getPendingProfessionalVerificationUsers();
        const transformedData = users.map((user) => ({
          id: user._id,
          userId: user._id,
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          documentType:
            user.professionalVerification?.profession ||
            "Professional Verification",
          documentNumber: user.professionalVerification?.licenseNumber || "N/A",
          submittedDate:
            user.professionalVerification?.submittedAt || user.createdAt,
          status: user.professionalVerification?.status || "Pending",
          documents: user.professionalVerification?.documents || [],
          userInfo: {
            fullName: `${user.firstName} ${user.lastName}`,
            businessName: user.professionalVerification?.businessName || "",
            profession: user.professionalVerification?.profession || "",
            experience: user.professionalVerification?.experience || "",
          },
        }));

        setPendingVerifications(transformedData);
      } else {
        alert(result?.message || `Failed to ${action} verification`);
      }
    } catch (error) {
      console.error("Error processing verification:", error);
      alert("Failed to process verification. Please try again.");
    }
  };

  const openDocumentDialog = (verification) => {
    setSelectedVerification(verification);
    setShowDocumentDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Verification</h1>
          <p className="text-gray-600 mt-1">
            Review and approve user identification documents
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            {pendingVerifications.length} Pending
          </Badge>
          <Badge variant="outline" className="bg-green-100 text-green-800">
            {recentVerifications.filter((v) => v.status === "approved").length}{" "}
            Approved Today
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Review ({pendingVerifications.length})
          </TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Loading Verifications
                </h3>
                <p className="text-gray-500 text-center mt-2">
                  Fetching pending professional verification submissions...
                </p>
              </CardContent>
            </Card>
          ) : pendingVerifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700">
                  No Pending Verifications
                </h3>
                <p className="text-gray-500 text-center mt-2">
                  All user verifications are up to date. Check back later for
                  new submissions.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingVerifications.map((verification) => (
                <Card
                  key={verification.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={`/api/placeholder/user/${verification.userId}`}
                          />
                          <AvatarFallback>
                            {verification.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">
                              {verification.userName}
                            </h3>
                            {getStatusBadge(verification.status)}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {verification.userEmail}
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {verification.documentType}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {verification.submittedDate}
                            </div>
                          </div>

                          <div className="text-sm">
                            <span className="font-medium">
                              Document Number:
                            </span>{" "}
                            {verification.documentNumber}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDocumentDialog(verification)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid gap-4">
            {recentVerifications.map((verification) => (
              <Card key={verification.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {verification.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">
                            {verification.userName}
                          </h4>
                          {getStatusBadge(verification.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {verification.documentType} •{" "}
                          {verification.verifiedDate} • by{" "}
                          {verification.verifiedBy}
                        </div>
                        {verification.reason && (
                          <div className="text-sm text-red-600 mt-1">
                            Reason: {verification.reason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Document Review Dialog */}
      <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Verification Documents</DialogTitle>
            <DialogDescription>
              Review the submitted documents and user information for
              verification
            </DialogDescription>
          </DialogHeader>

          {selectedVerification && (
            <div className="space-y-6">
              {/* User Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <p className="mt-1">
                        {selectedVerification.userInfo.fullName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <p className="mt-1">{selectedVerification.userEmail}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Profession
                      </label>
                      <p className="mt-1">
                        {selectedVerification.userInfo.profession}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Business Name
                      </label>
                      <p className="mt-1">
                        {selectedVerification.userInfo.businessName ||
                          "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        License Number
                      </label>
                      <p className="mt-1">
                        {selectedVerification.documentNumber}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Experience
                      </label>
                      <p className="mt-1">
                        {selectedVerification.userInfo.experience ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Submitted Date
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <p>
                        {new Date(
                          selectedVerification.submittedDate,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Submitted Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedVerification.documents.map((doc, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{doc.name}</h4>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="bg-gray-100 rounded h-48 flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-2" />
                            <p className="text-sm">Document Preview</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={() =>
                    handleVerificationAction(
                      selectedVerification.id,
                      "rejected",
                      "Document verification failed",
                    )
                  }
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() =>
                    handleVerificationAction(
                      selectedVerification.id,
                      "approved",
                    )
                  }
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

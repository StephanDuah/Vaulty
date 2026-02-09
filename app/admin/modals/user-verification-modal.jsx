"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, FileText, Eye, Download } from "lucide-react";
import { verifyUser, rejectUser } from "@/app/action/AdminAction";
import { toast } from "sonner";

export default function UserVerificationModal({ user, isOpen, onClose }) {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const result = await verifyUser(user._id);
      if (result.status) {
        toast.success("User verified successfully");
        onClose();
      } else {
        toast.error(result.message || "Failed to verify user");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await rejectUser(user._id, rejectionReason);
      if (result.status) {
        toast.success("User rejected successfully");
        onClose();
      } else {
        toast.error(result.message || "Failed to reject user");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
      setRejectionReason("");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>User Verification</AlertDialogTitle>
          <AlertDialogDescription>
            Review and verify {user.firstName} {user.lastName}'s account details
            and documents
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* User Details Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Full Name
                  </p>
                  <p className="font-medium">
                    {[user.firstName, user.lastName].filter(Boolean).join(" ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Email Address
                  </p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Account Status
                  </p>
                  <p className="font-medium capitalize">{user.verification}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Account Created
                  </p>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KYC Documents Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Professional Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* ID Document */}
              {user?.professionalVerification?.documents &&
                user.professionalVerification.documents.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">Identity Document</h5>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm">Document Preview</p>
                      <p className="text-xs mt-1">
                        {user.professionalVerification.documents[0]?.type ||
                          "ID Document"}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600 mt-3">
                      <p>
                        Document Type:{" "}
                        {user.professionalVerification.documents[0]?.type ||
                          "Not specified"}
                      </p>
                      <p>
                        License Number:{" "}
                        {user.professionalVerification.licenseNumber ||
                          "Not provided"}
                      </p>
                      <p>
                        Submitted:{" "}
                        {user.professionalVerification.submittedAt
                          ? new Date(
                              user.professionalVerification.submittedAt,
                            ).toLocaleDateString()
                          : "Not available"}
                      </p>
                    </div>
                  </div>
                )}

              {/* Address Proof */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium">Business Information</h5>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm">Business Registration</p>
                  <p className="text-xs mt-1">
                    {user.professionalVerification.businessRegistration ||
                      "Business Document"}
                  </p>
                </div>
                <div className="text-sm text-gray-600 mt-3">
                  <p>
                    Business Name:{" "}
                    {user.professionalVerification.businessName ||
                      "Not specified"}
                  </p>
                  <p>
                    Registration:{" "}
                    {user.professionalVerification.businessRegistration ||
                      "Not provided"}
                  </p>
                  <p>
                    Submitted:{" "}
                    {user.professionalVerification.submittedAt
                      ? new Date(
                          user.professionalVerification.submittedAt,
                        ).toLocaleDateString()
                      : "Not available"}
                  </p>
                </div>
              </div>

              {/* Additional Documents */}
              {user?.professionalVerification?.additionalDocuments &&
                user.professionalVerification.additionalDocuments.length >
                  0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium">Additional Documents</h5>
                    {user.professionalVerification.additionalDocuments.map(
                      (doc, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 rounded border border-border hover:bg-secondary/50"
                        >
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">
                            {doc.name || doc.type}
                          </span>
                          <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                        </div>
                      ),
                    )}
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Verification Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Verification Notes (Optional)
            </label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this verification..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-20"
            />
          </div>

          {/* Rejection Reason */}
          {user.verification === "pending" && (
            <div className="space-y-2">
              <label htmlFor="rejectionReason" className="text-sm font-medium">
                Rejection Reason (Required)
              </label>
              <Textarea
                id="rejectionReason"
                placeholder="Please provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-20"
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>

          {user.verification === "pending" && (
            <AlertDialogAction asChild>
              <Button
                onClick={handleReject}
                disabled={isSubmitting}
                variant="destructive"
                className="mr-2"
              >
                {isSubmitting ? "Rejecting..." : "Reject"}
              </Button>
            </AlertDialogAction>
          )}

          {user.verification !== "verified" && (
            <AlertDialogAction asChild>
              <Button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Approving..." : "Approve"}
              </Button>
            </AlertDialogAction>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

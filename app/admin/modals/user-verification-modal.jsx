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
import { CheckCircle, FileText } from "lucide-react";

export default function UserVerificationModal({
  user,
  isOpen,
  onClose,
  onConfirm,
}) {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm(notes);
      setNotes("");
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>User Verification</AlertDialogTitle>
          <AlertDialogDescription>
            Review and verify user account details below
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
              <CardTitle className="text-base">KYC Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* ID Document */}
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
                    <div className="text-center text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">ID Document Preview</p>
                      <p className="text-xs mt-1">
                        {user?.kyc?.idDocument?.type || "Government ID"}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-3">
                    <p>
                      Document Type:{" "}
                      {user?.kyc?.idDocument?.type || "Not specified"}
                    </p>
                    <p>
                      Document Number:{" "}
                      {user?.kyc?.idDocument?.number || "Not provided"}
                    </p>
                    <p>
                      Submitted:{" "}
                      {user?.kyc?.idDocument?.submittedAt
                        ? new Date(
                            user.kyc.idDocument.submittedAt,
                          ).toLocaleDateString()
                        : "Not available"}
                    </p>
                  </div>
                </div>

                {/* Address Proof */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium">Proof of Address</h5>
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
                    <div className="text-center text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">Address Proof Preview</p>
                      <p className="text-xs mt-1">
                        {user?.kyc?.addressProof?.type ||
                          "Utility Bill/Bank Statement"}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-3">
                    <p>
                      Document Type:{" "}
                      {user?.kyc?.addressProof?.type || "Not specified"}
                    </p>
                    <p>
                      Address:{" "}
                      {user?.kyc?.addressProof?.address || "Not provided"}
                    </p>
                    <p>
                      Submitted:{" "}
                      {user?.kyc?.addressProof?.submittedAt
                        ? new Date(
                            user.kyc.addressProof.submittedAt,
                          ).toLocaleDateString()
                        : "Not available"}
                    </p>
                  </div>
                </div>

                {/* Additional Documents */}
                {user?.kyc?.additionalDocuments &&
                  user.kyc.additionalDocuments.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium">Additional Documents</h5>
                      {user.kyc.additionalDocuments.map((doc, index) => (
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
                      ))}
                    </div>
                  )}
              </div>
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
              className="min-h-24"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? "Verifying..." : "Confirm Verification"}
            </Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

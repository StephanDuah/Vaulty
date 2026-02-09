"use client";

import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Shield, CheckCircle, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

const VerificationStatus = ({ verification, showActions = true }) => {
  const getStatusInfo = () => {
    switch (verification) {
      case "verified":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50 border-green-200",
          title: "Account Verified",
          description: "Your account is fully verified. You can create products and sell on TrustVault.",
          status: "Verified"
        };
      case "pending":
        return {
          icon: Clock,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50 border-yellow-200",
          title: "Verification Pending",
          description: "Your verification is under review. This usually takes 1-2 business days.",
          status: "Pending"
        };
      case "rejected":
        return {
          icon: AlertCircle,
          color: "text-red-600",
          bgColor: "bg-red-50 border-red-200",
          title: "Verification Rejected",
          description: "Your verification was not approved. Please review the requirements and try again.",
          status: "Rejected"
        };
      default:
        return {
          icon: AlertCircle,
          color: "text-gray-600",
          bgColor: "bg-gray-50 border-gray-200",
          title: "Verification Required",
          description: "You need to complete KYC verification to start selling on TrustVault.",
          status: "Not Verified"
        };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  return (
    <Card className={`border-0 shadow-lg ${statusInfo.bgColor}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${statusInfo.bgColor}`}>
            <Icon className={`h-6 w-6 ${statusInfo.color}`} />
          </div>
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              {statusInfo.title}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                {statusInfo.status}
              </span>
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <AlertDescription className="text-base">
          {statusInfo.description}
        </AlertDescription>

        {showActions && (
          <div className="space-y-3 pt-4 border-t">
            {verification === "verified" ? (
              <div className="flex items-center gap-2 text-green-700">
                <Shield className="h-5 w-5" />
                <span className="font-medium">You're all set! You can now create products and manage your sales.</span>
              </div>
            ) : verification === "pending" ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  While you wait, you can still browse and learn about selling on TrustVault.
                </p>
                <Button variant="outline" className="w-full">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Learn About Selling
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Verification Requirements:</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Valid government-issued ID</li>
                      <li>• Proof of address</li>
                      <li>• Business registration documents (if applicable)</li>
                      <li>• Clear photo of your face</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                
                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href="/seller/profile">
                      Complete Verification
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/help/verification">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerificationStatus;

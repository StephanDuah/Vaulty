"use client";

import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Shield,
  CheckCircle,
  Clock,
  ArrowRight,
  Icon,
} from "lucide-react";
import Link from "next/link";

const VerificationStatus = ({ verification, showActions = true }) => {
  console.log(verification);
  const getStatusInfo = () => {
    switch (verification) {
      case "Verified":
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          title: "Verified",
          description: "Your identity has been verified successfully.",
          color: "text-green-600",
          bgColor: "bg-green-100",
          action: "Manage Account",
        };
      case "Pending":
        return {
          icon: <Clock className="h-5 w-5 text-yellow-600" />,
          title: "Pending Verification",
          description: "Your verification is currently under review.",
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          action: "Check Status",
        };
      case "Failed":
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-600" />,
          title: "Verification Failed",
          description:
            "Your verification was not successful. Please try again.",
          color: "text-red-600",
          bgColor: "bg-red-100",
          action: "Try Again",
        };
      default:
        return {
          icon: <Shield className="h-5 w-5 text-blue-600" />,
          title: "Verification Required",
          description: "Complete your verification to start selling.",
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          action: "Get Verified",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className={`border-0 shadow-lg ${statusInfo.bgColor}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${statusInfo.bgColor}`}>
            {statusInfo.icon}
          </div>
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              {statusInfo.title}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
              >
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
            {verification === "Verified" ? (
              <div className="flex items-center gap-2 text-green-700">
                <Shield className="h-5 w-5" />
                <span className="font-medium">
                  You're all set! You can now create products and manage your
                  sales.
                </span>
              </div>
            ) : verification === "Pending" ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  While you wait, you can still browse and learn about selling
                  on TrustVault.
                </p>
                <Button asChild className="w-full">
                  <Link href="/dashboard/verification">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    {statusInfo.action}
                  </Link>
                </Button>
              </div>
            ) : verification === "Failed" ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Please check your documents and try again. Contact support if
                  you need help.
                </p>
                <Button asChild className="w-full">
                  <Link href="/dashboard/verification">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    {statusInfo.action}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Complete your verification to start selling on TrustVault.
                </p>
                <Button asChild className="w-full">
                  <Link href="/dashboard/verification">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    {statusInfo.action}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerificationStatus;

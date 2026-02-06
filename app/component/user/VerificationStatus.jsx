"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Upload,
  ExternalLink
} from "lucide-react";

export default function VerificationStatus() {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching verification status
    const fetchVerificationStatus = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - in real app, this would come from API
        setVerificationStatus({
          status: "pending", // pending, verified, rejected
          submittedDate: "2024-02-05",
          documentType: "Passport",
          documentNumber: "P123456789",
          lastUpdated: "2024-02-05T10:30:00Z"
        });
      } catch (error) {
        console.error("Error fetching verification status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationStatus();
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        title: "Verification Pending",
        description: "Your documents are being reviewed",
        action: "View Submission"
      },
      verified: {
        icon: CheckCircle,
        color: "bg-green-100 text-green-800 border-green-200",
        title: "Verified",
        description: "Your identity has been successfully verified",
        action: "View Certificate"
      },
      rejected: {
        icon: AlertCircle,
        color: "bg-red-100 text-red-800 border-red-200",
        title: "Verification Failed",
        description: "Your documents could not be verified",
        action: "Resubmit Documents"
      },
      not_submitted: {
        icon: Upload,
        color: "bg-gray-100 text-gray-800 border-gray-200",
        title: "Not Verified",
        description: "Submit your documents to verify your identity",
        action: "Submit Documents"
      }
    };

    return configs[status] || configs.not_submitted;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(verificationStatus?.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Identity Verification</h1>
        <p className="text-gray-600">Manage your identity verification status</p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${statusConfig.color.split(' ')[0]}`}>
                <StatusIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{statusConfig.title}</h3>
                <p className="text-gray-600">{statusConfig.description}</p>
              </div>
            </div>
            <Badge variant="outline" className={statusConfig.color}>
              {verificationStatus?.status?.replace('_', ' ').toUpperCase() || 'NOT SUBMITTED'}
            </Badge>
          </div>

          {verificationStatus && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium text-gray-700">Document Type</label>
                <p className="mt-1">{verificationStatus.documentType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Document Number</label>
                <p className="mt-1">{verificationStatus.documentNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Submitted Date</label>
                <p className="mt-1">{verificationStatus.submittedDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Updated</label>
                <p className="mt-1">
                  {new Date(verificationStatus.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button 
              asChild
              className={verificationStatus?.status === 'verified' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
            >
              <a href="/dashboard/verification">
                {statusConfig.action}
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Information Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Why Verification Matters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Increased Trust</p>
                <p className="text-sm text-gray-600">Verified users gain higher trust levels in transactions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Higher Limits</p>
                <p className="text-sm text-gray-600">Access to increased transaction limits and features</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Priority Support</p>
                <p className="text-sm text-gray-600">Get faster customer support for your account</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Verification Process
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-medium">1</div>
              <div>
                <p className="font-medium">Submit Documents</p>
                <p className="text-sm text-gray-600">Upload valid identification documents</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-medium">2</div>
              <div>
                <p className="font-medium">Review Process</p>
                <p className="text-sm text-gray-600">Our team reviews your documents (24-48 hours)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-medium">3</div>
              <div>
                <p className="font-medium">Get Verified</p>
                <p className="text-sm text-gray-600">Receive notification once approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {verificationStatus?.status === 'pending' && (
        <Alert className="border-blue-200 bg-blue-50">
          <Clock className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Your verification is currently under review. This typically takes 24-48 hours. 
            You'll receive an email notification once the process is complete.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

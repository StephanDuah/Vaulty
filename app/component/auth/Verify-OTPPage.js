"use client";

import { useState, useEffect } from "react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OTPInput } from "@/app/component/auth/otp-input";
import {
  Shield,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { resendOtp, verify } from "@/app/action/UserActions";

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const sid = searchParams.get("sid");
  const phone = searchParams.get("phone") || "";
  const email = searchParams.get("email") || "";
  const type = searchParams.get("type") || "mobile";

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOTPComplete = async (otpValue) => {
    setOtp(otpValue);
    setError("");
    setIsVerifying(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const result = await verify(sid, otpValue);
      if (result.status) {
        setSuccess(result.status);
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError("");

    try {
      // Simulate API call
      await resendOtp(sid);

      setTimeLeft(300); // Reset timer
      setCanResend(false);
      setOtp("");
    } catch (err) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (!sid) {
    notFound();
  }
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Verification Successful!
                </h2>
                <p className="text-gray-600 mt-2">
                  Redirecting to your dashboard...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Verify Your {type === "mobile" ? "Phone" : "Email"}
          </CardTitle>
          <CardDescription className="text-gray-600">
            We have sent a 6-digit verification code to your phone number
            <span className="font-medium text-gray-900">
              {type === "mobile" ? phone : email}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <OTPInput
              length={6}
              onComplete={handleOTPComplete}
              disabled={isVerifying}
              error={!!error}
            />

            {error && (
              <Alert variant="destructive" className="flex items-center">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isVerifying && (
              <div className="flex items-center justify-center space-x-2 text-primary">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Verifying code...</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Code expires in {formatTime(timeLeft)}</span>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn t receive the code?
              </p>
              <Button
                variant="outline"
                onClick={handleResendOTP}
                disabled={!canResend || isResending}
                className="w-full bg-transparent"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Resend Code"
                )}
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-500">
                Having trouble? Contact our support team
              </p>
              <Link
                href="/help"
                className="text-xs text-primary hover:underline"
              >
                Get Help
              </Link>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

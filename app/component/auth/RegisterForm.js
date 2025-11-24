"use client";

import Image from "next/image";
import RegisterImage from "@/public/images/auth/registerImage.jpg";
import { createSeller } from "@/app/action/UserActions";
import { useActionState } from "react";
import Link from "next/link";
import {
  Shield,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Lock,
  Phone,
  Building,
  Clock,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "../PasswordInput";

const initialState = {
  type: "",
  message: "",
  values: {
    businessName: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    dtd: "",
  },
  errors: {},
};

const RegisterForm = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-primary/0 to-background flex items-center justify-center p-4">
      <section className="w-full max-w-7xl h-[95vh] bg-white shadow-2xl rounded-3xl overflow-hidden flex">
        {/* Left Side - Image Section */}
        <div className="h-full w-full bg-black flex-1 relative hidden md:block">
          {/* Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={RegisterImage || "/placeholder.svg"}
              fill
              className="object-cover"
              alt="TrustVault Registration"
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/90 via-primary/70 to-secondary/80"></div>

          {/* Content */}
          <div className="flex flex-col justify-between py-12 px-8 w-full h-full relative z-10">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h6 className="text-2xl font-bold text-white">TrustVault</h6>
              </div>
              <p className="text-white/90 text-lg">
                Join thousands of sellers using our secure escrow platform
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">
                Start Selling with Confidence
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/20 mt-1">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      Secure Payment Processing
                    </p>
                    <p className="text-white/80 text-sm">
                      Get paid safely through our escrow system
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/20 mt-1">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      Easy Product Management
                    </p>
                    <p className="text-white/80 text-sm">
                      Simple dashboard to manage your inventory
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/20 mt-1">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      Mobile Money Integration
                    </p>
                    <p className="text-white/80 text-sm">
                      Receive payments directly to your mobile wallet
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/20 mt-1">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Fraud Protection</p>
                    <p className="text-white/80 text-sm">
                      Complete protection against fraudulent transactions
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-white/60 text-sm">
                Join over 10,000+ successful sellers across Africa
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="h-full w-full flex-1 bg-gradient-to-b from-white to-neutral/20 overflow-y-auto">
          <FormSection />
        </div>
      </section>
    </div>
  );
};

const FormSection = () => {
  const [state, formAction, pending] = useActionState(
    createSeller,
    initialState
  );

  const DisplayToast = ({ state }) => {
    if (state.type === "error") {
      return (
        <Alert variant="destructive" className="animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      );
    } else if (state.type === "success") {
      return (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-950/10 animate-fade-in">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-400">
            {state.message}
          </AlertDescription>
        </Alert>
      );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-primary/10">
        <Link
          href="/"
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        <div className="flex items-center gap-2 md:hidden">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-primary">TrustVault</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl"></div>
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg border border-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              Join TrustVault
            </h1>
            <p className="text-muted-foreground">
              Create your seller account and start selling with escrow
              protection
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {state && <DisplayToast state={state} />}

            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="businessName"
                  className="text-primary font-medium"
                >
                  Business Name
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="businessName"
                    name="businessName"
                    placeholder="Love God Tailoring Shop"
                    required
                    className="pl-10 border-primary/20 focus-visible:ring-primary h-11"
                    defaultValue={state.values?.businessName}
                  />
                </div>
                {state.errors.businessName && (
                  <p className="text-sm text-red-500">
                    {state.errors?.businessName}
                  </p>
                )}
              </div>
              {/* First Name and Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-primary font-medium"
                  >
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      required
                      className="pl-10 border-primary/20 focus-visible:ring-primary h-11"
                      defaultValue={state.values?.firstName}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-primary font-medium"
                  >
                    Last Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      required
                      className="pl-10 border-primary/20 focus-visible:ring-primary h-11"
                      defaultValue={state.values?.lastName}
                    />
                  </div>
                </div>
              </div>

              {/* Business Name */}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="phoneNo" className="text-primary font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phoneNo"
                    name="phoneNo"
                    placeholder="0245113465"
                    required
                    minLength={10}
                    maxLength={10}
                    className="pl-10 border-primary/20 focus-visible:ring-primary h-11"
                    defaultValue={state.values?.phoneNo}
                  />
                </div>
                {state.errors.phoneNo && (
                  <p className="text-sm text-red-500">
                    {state.errors?.phoneNo}
                  </p>
                )}
              </div>

              {/* Password and Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-primary font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <PasswordInput
                      id="password"
                      name="password"
                      placeholder="Enter password"
                      required
                      minLength={6}
                      className="pl-10 border-primary/20 focus-visible:ring-primary h-11"
                    />
                  </div>
                  {state.errors?.password && (
                    <p className="text-sm text-red-500">
                      {state.errors?.password}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-primary font-medium"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <PasswordInput
                      id="confirmPassword"
                      name="confirm_password"
                      placeholder="Confirm password"
                      required
                      minLength={6}
                      className=" pl-10 border-primary/20 focus-visible:ring-primary h-11"
                    />
                  </div>
                  {state.errors?.password && (
                    <p className="text-sm text-red-500">
                      {state.errors?.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone Number and Days to Deliver */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-primary font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seller@example.com"
                      required
                      className="pl-10 border-primary/20 focus-visible:ring-primary h-11"
                      defaultValue={state.values?.email}
                    />
                  </div>
                  {state.errors.email && (
                    <p className="text-sm text-red-500">
                      {state.errors?.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dtd" className="text-primary font-medium">
                    Days To Deliver
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dtd"
                      name="dtd"
                      type="number"
                      min={1}
                      defaultValue={state.values?.dtd || 1}
                      required
                      className="pl-10 border-primary/20 focus-visible:ring-primary h-11"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={pending}
                className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 text-white font-medium"
              >
                {pending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Seller Account"
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-primary/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Registration */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  type="button"
                  className="border-primary/20 hover:bg-primary/5 bg-transparent h-11"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#1877F2"
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="border-primary/20 hover:bg-primary/5 bg-transparent h-11"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            and
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

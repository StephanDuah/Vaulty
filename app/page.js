import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Users, CreditCard, Package, ArrowRight } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Icon from "./component/icon";

export default async function HomePage() {
  // const session = await auth();
  // if (session) return redirect("/seller");
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon />
            </div>
            <nav className="flex items-center space-x-6">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Login
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" size="sm">
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
              Secure Marketplace for
              <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                {" "}
                Trusted Trading
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Buy and sell with confidence using our escrow-protected platform.
              Your transactions are secured until both parties are satisfied.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/90 shadow-lg"
                >
                  Start Selling
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Why Choose TrustVault?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform provides the security and trust you need for safe
              online transactions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Escrow Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Your money is held securely until you confirm receipt and
                  satisfaction with your purchase.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl">Verified Users</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  All sellers go through our verification process to ensure
                  legitimate and trustworthy trading.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Secure Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Multiple payment options including mobile money, bank
                  transfers, and digital wallets.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                  <Package className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Easy Listing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  List your products quickly with our intuitive interface and
                  reach buyers instantly.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Simple steps to secure trading on TrustVault
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">List or Browse</h3>
              <p className="text-muted-foreground">
                Sellers list their products with detailed descriptions. Buyers
                browse and find what they need.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-secondary to-secondary/80 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure Payment</h3>
              <p className="text-muted-foreground">
                Buyer makes payment which is held in escrow until the
                transaction is completed successfully.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Complete & Release</h3>
              <p className="text-muted-foreground">
                Once buyer confirms receipt and satisfaction, payment is
                released to the seller.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/90">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Trading Safely?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who trust TrustVault for their online
              transactions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6" />
                <h3 className="text-xl font-bold">TrustVault</h3>
              </div>
              <p className="text-gray-400">
                Secure marketplace for trusted online trading with escrow
                protection.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Fees
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Dispute Resolution
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Status
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TrustVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

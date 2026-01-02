"use client";

import React, { useState, useEffect, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Clock1,
  Search,
  ShoppingCart,
  User,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Package,
  Shield,
  X,
  Plus,
  Minus,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createTransaction } from "@/app/action/TransactionAction";
import Modal from "./Modal";
import { displayCurrency } from "@/lib/utils";
import { getProducts } from "@/app/action/ProductAction";
import Icon from "../IconImage";

const countryCodes = [
  { code: "+233", country: "GH", flag: "🇬🇭" },
  { code: "+44", country: "GB", flag: "🇬🇧" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+81", country: "JP", flag: "🇯🇵" },
];

const STEPS = [
  { id: 1, title: "Select Products", icon: Package },
  { id: 2, title: "Contact Info", icon: User },
  { id: 3, title: "Review & Pay", icon: CreditCard },
];

const CheckoutForm = ({ user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const userForm = use(user);
  const { businessName, phoneNo, email, dtd, _id, firstName, lastName } =
    userForm;

  useEffect(() => {
    setSubtotal(
      selectedProducts.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      )
    );
  }, [selectedProducts]);

  const handlePayment = async () => {
    try {
      const newInputFormat = selectedProducts.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        baseprice: item.price,
        variations: {},
      }));

      const { firstName, lastName, location, phone } = userDetails;
      const data = {
        items: newInputFormat,
        buyerDetail: { firstName, lastName, location, phoneNumber: phone },
        totalAmount: subtotal,
        sellerId: _id,
      };

      setLoading(true);
      const response = await createTransaction(data);
      setResponse(response);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToStep2 = selectedProducts.length > 0;
  const canProceedToStep3 =
    userDetails.firstName &&
    userDetails.lastName &&
    userDetails.location &&
    userDetails.phone;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-primary/0 to-background">
      <Modal loading={loading} response={response} />

      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Icon />
            <h1 className="text-3xl font-bold text-primary">Checkout</h1>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                      currentStep >= step.id
                        ? "bg-primary border-primary text-white"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p
                      className={`text-sm font-medium ${
                        currentStep >= step.id
                          ? "text-primary"
                          : "text-gray-400"
                      }`}
                    >
                      Step {step.id}
                    </p>
                    <p
                      className={`text-lg ${
                        currentStep >= step.id
                          ? "text-primary"
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.id ? "bg-primary" : "bg-gray-300"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <ProductSearchStep
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                sellerId={_id}
              />
            )}

            {currentStep === 2 && (
              <ContactInfoStep
                setDetails={setUserDetails}
                userDetails={userDetails}
              />
            )}

            {currentStep === 3 && (
              <ReviewStep
                selectedProducts={selectedProducts}
                userDetails={userDetails}
                subtotal={subtotal}
                onPayment={handlePayment}
                loading={loading}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !canProceedToStep2) ||
                    (currentStep === 2 && !canProceedToStep3)
                  }
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : null}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileDisplay
              name={firstName + "" + lastName}
              businessName={businessName}
              phoneNumber={phoneNo}
              location="Tafo Bonsuom"
              email={email}
              dtd={dtd}
            />

            <OrderSummary
              selectedProducts={selectedProducts}
              subtotal={subtotal}
              currentStep={currentStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated Product Search Step with real data
const ProductSearchStep = ({
  searchQuery,
  setSearchQuery,
  selectedProducts,
  setSelectedProducts,
  sellerId,
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products from database
  useEffect(() => {
    async function fetchProducts() {
      if (!sellerId) return;

      try {
        setIsLoading(true);
        setError(null);
        const data = await getProducts(sellerId);
        console.log(data);
        console.log("Fetched products:", data);
        const newFormat = data?.map((items) => ({
          ...items,
          price: items.basePrice,
        }));
        setProducts(newFormat || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [sellerId]);

  // Search products when query changes
  useEffect(() => {
    if (searchQuery.length >= 2 && products.length > 0) {
      setIsSearching(true);
      // Simulate API call delay for better UX
      const timer = setTimeout(() => {
        const results = products.filter((product) =>
          product.productCode?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery, products]);

  const handleProductSelect = (product, isSelected) => {
    if (isSelected) {
      // Add product with quantity 1
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    } else {
      // Remove product
      setSelectedProducts(
        selectedProducts.filter((p) => p._id !== product._id)
      );
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setSelectedProducts(selectedProducts.filter((p) => p._id !== productId));
    } else {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p._id === productId ? { ...p, quantity: newQuantity } : p
        )
      );
    }
  };

  const isProductSelected = (productId) => {
    return selectedProducts.some((p) => p._id === productId);
  };

  const getProductQuantity = (productId) => {
    const product = selectedProducts.find((p) => p._id === productId);
    return product ? product.quantity : 0;
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Package className="w-6 h-6 text-primary" />
          Search & Select Products
        </CardTitle>
        <p className="text-muted-foreground">
          Search for products by name and select what you want to buy
        </p>
      </CardHeader>
      <CardContent className="p-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search products by product code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-10 h-14 text-lg border-primary/20 focus-visible:ring-primary"
            disabled={isLoading}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Loading Products
            </h3>
            <p className="text-gray-500">
              Please wait while we fetch the products...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-600 mb-2">
              Error Loading Products
            </h3>
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Selected Products Summary */}
        {selectedProducts.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">
              Selected Products ({selectedProducts.length})
            </h3>
            <div className="space-y-2">
              {selectedProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-green-700">
                    {product.name} × {product.quantity}
                  </span>
                  <span className="font-medium text-green-800">
                    {displayCurrency(product.price * product.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {!isLoading && !error && (
          <div className="space-y-4">
            {searchQuery.length < 2 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Search for Products
                </h3>
                <p className="text-gray-500">
                  Type at least 2 characters to search for products
                </p>
                {products.length > 0 && (
                  <p className="text-sm text-gray-400 mt-2">
                    {products.length} products available
                  </p>
                )}
              </div>
            )}

            {isSearching && (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-gray-500">Searching...</p>
              </div>
            )}

            {searchQuery.length >= 2 &&
              !isSearching &&
              searchResults.length === 0 && (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No products found for {searchQuery}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try searching for different keywords
                  </p>
                </div>
              )}

            {searchResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">
                  Search Results ({searchResults.length})
                </h3>
                {searchResults.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    isSelected={isProductSelected(product._id)}
                    quantity={getProductQuantity(product._id)}
                    onSelect={handleProductSelect}
                    onQuantityChange={updateQuantity}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Updated Product Card Component to work with database fields
const ProductCard = ({
  product,
  isSelected,
  quantity,
  onSelect,
  onQuantityChange,
}) => {
  return (
    <div
      className={`border rounded-lg p-4 transition-all ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Product Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-lg">{product.name}</h4>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {product.category || "General"}
                </Badge>
                <span className="text-lg font-bold text-green-600">
                  {displayCurrency(product.price)}
                </span>
              </div>
              {product.quantity && (
                <p className="text-xs text-gray-500 mt-1">
                  Stock: {product.quantity} available
                </p>
              )}
            </div>

            {/* Selection Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`product-${product._id}`}
                  checked={isSelected}
                  onCheckedChange={(checked) => onSelect(product, checked)}
                />
                <Label
                  htmlFor={`product-${product._id}`}
                  className="cursor-pointer"
                >
                  Select
                </Label>
              </div>
            </div>
          </div>

          {/* Quantity Controls */}
          {isSelected && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuantityChange(product._id, quantity - 1)}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuantityChange(product._id, quantity + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {console.log(quantity)}
                Total: {displayCurrency(product.price * quantity)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Rest of the components remain the same...
const ContactInfoStep = ({ setDetails, userDetails }) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState("+233");

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const location = formData.get("location");
    const email = formData.get("email");
    const phone = formData.get("phone");

    const fullPhoneNumber = `0${phone}`;
    const contactInfo = {
      firstName,
      lastName,
      location,
      email,
      phone: fullPhoneNumber,
    };

    setDetails(contactInfo);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <User className="w-6 h-6 text-primary" />
          Contact Information
        </CardTitle>
        <p className="text-muted-foreground">
          Please provide your contact details for delivery
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-primary font-medium">
                First Name *
              </Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                required
                defaultValue={userDetails.firstName || ""}
                className="border-primary/20 focus-visible:ring-primary h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-primary font-medium">
                Last Name *
              </Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                required
                defaultValue={userDetails.lastName || ""}
                className="border-primary/20 focus-visible:ring-primary h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-primary font-medium">
              Delivery Location *
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="City, Region, Country"
              required
              defaultValue={userDetails.location || ""}
              className="border-primary/20 focus-visible:ring-primary h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-primary font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              required
              defaultValue={userDetails.email || ""}
              className="border-primary/20 focus-visible:ring-primary h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-primary font-medium">
              Phone Number *
            </Label>
            <div className="flex gap-2">
              <Select
                value={selectedCountryCode}
                onValueChange={setSelectedCountryCode}
              >
                <SelectTrigger className="w-[140px] border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <span className="flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span>{country.code}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                name="phone"
                type="tel"
                className="flex-1 border-primary/20 focus-visible:ring-primary h-11"
                placeholder="123-456-7890"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90"
          >
            Save Contact Information
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const ReviewStep = ({
  selectedProducts,
  userDetails,
  subtotal,
  onPayment,
  loading,
}) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <CreditCard className="w-6 h-6 text-primary" />
          Review & Payment
        </CardTitle>
        <p className="text-muted-foreground">
          Review your order and complete the payment
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Contact Information Review */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 text-primary">
            Delivery Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Name:</span> {userDetails.firstName}{" "}
              {userDetails.lastName}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {userDetails.phone}
            </div>
            <div className="md:col-span-2">
              <span className="font-medium">Location:</span>{" "}
              {userDetails.location}
            </div>
            <div className="md:col-span-2">
              <span className="font-medium">Email:</span> {userDetails.email}
            </div>
          </div>
        </div>

        {/* Order Items Review */}
        <div>
          <h3 className="font-semibold mb-3 text-primary">Order Items</h3>
          <div className="space-y-3">
            {selectedProducts.map((product) => (
              <div
                key={product._id}
                className="flex justify-between items-start p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {product.description}
                  </p>
                  <div className="text-sm text-gray-600 mt-1">
                    Quantity: {product.quantity}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    {displayCurrency(product.price * product.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total Amount:</span>
            <span className="text-green-600">{displayCurrency(subtotal)}</span>
          </div>
        </div>

        {/* Payment Button */}
        <Button
          onClick={onPayment}
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 shadow-lg"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing Payment...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Complete Secure Payment
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

const OrderSummary = ({ selectedProducts, subtotal, currentStep }) => {
  return (
    <Card className="border-0 shadow-lg sticky top-24">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-primary" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {selectedProducts.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No products selected</p>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedProducts.map((product) => (
              <div
                key={product._id}
                className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{product.name}</h4>
                  <div className="text-xs text-gray-600 mt-1">
                    Qty: {product.quantity}
                  </div>
                </div>
                <div className="text-sm font-bold text-green-600">
                  {displayCurrency(product.price * product.quantity)}
                </div>
              </div>
            ))}

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="text-lg font-bold text-green-600">
                  {displayCurrency(subtotal)}
                </span>
              </div>
            </div>

            {currentStep < 3 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  Complete the checkout process to place your order
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ProfileDisplay = ({
  name,
  businessName,
  location,
  email,
  dtd,
  phoneNumber,
  description,
  avatarUrl,
}) => {
  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "";
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
            <AvatarFallback className="bg-primary text-white text-lg">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{name}</CardTitle>
            <p className="text-muted-foreground flex items-center">
              <Briefcase className="w-4 h-4 mr-2" />
              {businessName}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>{location}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <a href={`mailto:${email}`} className="hover:underline text-primary">
            {email}
          </a>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <a
            href={`tel:${phoneNumber}`}
            className="hover:underline text-primary"
          >
            {phoneNumber}
          </a>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Clock1 className="w-4 h-4 text-muted-foreground" />
          <span>Delivery: {dtd} days</span>
        </div>

        <Badge variant="secondary" className="mt-3">
          <Shield className="w-3 h-3 mr-1" />
          Verified Seller
        </Badge>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;

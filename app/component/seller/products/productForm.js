"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createProduct } from "@/app/action/ProductAction";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Plus,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Tag,
  DollarSign,
  FileText,
  Settings,
  Trash2,
} from "lucide-react";

// Form validation schema
const productSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Product name must be at least 3 characters" }),
  basePrice: z.coerce
    .number()
    .positive({ message: "Base price must be a positive number" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  variations: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Variation name is required" }),
        options: z
          .array(z.string().min(1, { message: "Option is required" }))
          .min(1, { message: "At least one option is required" }),
      }),
    )
    .min(1, { message: "At least one variation is required" }),
});

export default function ProductForm() {
  const [variations, setVariations] = useState([{ name: "", options: [""] }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    type: "",
    message: "",
  });

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      basePrice: 0,
      description: "",
      variations: [{ name: "", options: [""] }],
    },
  });

  const addVariation = () => {
    setVariations([...variations, { name: "", options: [""] }]);
  };

  const removeVariation = (index) => {
    if (variations.length > 1) {
      const updated = variations.filter((_, i) => i !== index);
      setVariations(updated);
    }
  };

  const updateVariationName = (index, name) => {
    const updated = [...variations];
    updated[index].name = name;
    setVariations(updated);
  };

  const updateVariationOption = (varIndex, optIndex, value) => {
    const updated = [...variations];
    updated[varIndex].options[optIndex] = value;
    setVariations(updated);
  };

  const addOption = (varIndex) => {
    const updated = [...variations];
    updated[varIndex].options.push("");
    setVariations(updated);
  };

  const removeOption = (varIndex, optIndex) => {
    const updated = [...variations];
    if (updated[varIndex].options.length > 1) {
      updated[varIndex].options.splice(optIndex, 1);
      setVariations(updated);
    }
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    try {
      // Validate variations
      const validVariations = variations.filter(
        (variation) =>
          variation.name.trim() && variation.options.some((opt) => opt.trim()),
      );

      if (validVariations.length === 0) {
        setSubmitStatus({
          type: "error",
          message: "At least one variation with a name and option is required",
        });
        return;
      }

      const productData = {
        name: values.name,
        basePrice: values.basePrice,
        description: values.description,
        variations: validVariations.map((variation) => ({
          name: variation.name,
          options: variation.options.filter((opt) => opt.trim()),
        })),
      };

      const res = await createProduct(productData);

      if (res.success) {
        setSubmitStatus({
          type: "success",
          message:
            "Product created successfully! Your product is now available for buyers.",
        });
        // Reset form
        form.reset();
        setVariations([{ name: "", options: [""] }]);
      } else {
        setSubmitStatus({
          type: "error",
          message: res.message || "Failed to create product. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-primary/0 to-background py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl"></div>
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg border border-primary/10">
                <Package className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">
            Create New Product
          </h1>
          <p className="text-muted-foreground text-lg">
            Add your product details and variations to start selling with
            TrustVault
          </p>
        </div>

        {/* Status Messages */}
        {submitStatus.type && (
          <Alert
            variant={submitStatus.type === "error" ? "destructive" : "default"}
            className={`mb-6 ${
              submitStatus.type === "success"
                ? "bg-green-50 border-green-200 dark:bg-green-950/10"
                : ""
            }`}
          >
            {submitStatus.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription
              className={
                submitStatus.type === "success"
                  ? "text-green-800 dark:text-green-400"
                  : ""
              }
            >
              {submitStatus.message}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            {/* Basic Product Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <FileText className="w-6 h-6 text-primary" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Enter the essential details about your product
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-primary font-medium">
                          <Tag className="w-4 h-4" />
                          Product Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Premium Wireless Headphones"
                            className="border-primary/20 focus-visible:ring-primary h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="basePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-primary font-medium">
                          <DollarSign className="w-4 h-4" />
                          Base Price *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className="border-primary/20 focus-visible:ring-primary h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-primary font-medium">
                        <FileText className="w-4 h-4" />
                        Product Description *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your product in detail. Include features, specifications, and what makes it special..."
                          className="border-primary/20 focus-visible:ring-primary min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Product Variations */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Settings className="w-6 h-6 text-primary" />
                  Product Variations
                </CardTitle>
                <CardDescription>
                  Add different options for your product like size, color, or
                  style
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {variations.map((variation, varIndex) => (
                  <Card
                    key={varIndex}
                    className="border border-primary/10 bg-gradient-to-r from-neutral/20 to-white"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary"
                          >
                            Variation {varIndex + 1}
                          </Badge>
                        </CardTitle>
                        {variations.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVariation(varIndex)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block mb-2 font-medium text-primary">
                          Variation Name *
                        </label>
                        <Input
                          type="text"
                          value={variation.name}
                          onChange={(e) =>
                            updateVariationName(varIndex, e.target.value)
                          }
                          className="border-primary/20 focus-visible:ring-primary h-11"
                          placeholder="e.g., Size, Color, Material"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="block font-medium text-primary">
                          Options *
                        </label>
                        {variation.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className="flex items-center gap-2"
                          >
                            <Input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                updateVariationOption(
                                  varIndex,
                                  optIndex,
                                  e.target.value,
                                )
                              }
                              className="border-primary/20 focus-visible:ring-primary h-11"
                              placeholder="e.g., Small, Red, Cotton"
                            />
                            {variation.options.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOption(varIndex, optIndex)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addOption(varIndex)}
                          className="border-primary/20 text-primary hover:bg-primary/5 bg-transparent"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Option
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  type="button"
                  onClick={addVariation}
                  className="w-full h-12 bg-gradient-to-r from-secondary to-secondary/90 text-primary shadow-lg shadow-secondary/20 transition-all hover:shadow-secondary/30"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Another Variation
                </Button>
              </CardContent>
            </Card>

            {/* Submit Section */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="rounded-lg bg-primary/5 p-6">
                    <h3 className="text-lg font-semibold mb-2 text-primary">
                      Ready to Create Your Product?
                    </h3>
                    <p className="text-muted-foreground">
                      Once you submit, your product will be added to your
                      inventory and you'll receive a unique product code to
                      share with buyers.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 text-lg font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating Product...
                      </>
                    ) : (
                      <>
                        <Package className="mr-2 h-5 w-5" />
                        Create Product
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-muted-foreground">
                    By creating this product, you agree to TrustVault&apos;s
                    seller terms and conditions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}

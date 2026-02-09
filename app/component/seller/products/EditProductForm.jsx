"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { updateProduct } from "@/app/action/ProductAction";

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
  variations: z.array(z.object({
    name: z.string().min(1, { message: "Variation name is required" }),
    options: z.array(z.string().min(1, { message: "Option is required" })).min(1, { message: "At least one option is required" })
  })).min(1, { message: "At least one variation is required" })
});

const EditProductForm = ({ product }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [variations, setVariations] = useState(product.variations || [{ name: "", options: [""] }]);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name || "",
      basePrice: product.basePrice || 0,
      description: product.description || "",
      variations: product.variations || [{ name: "", options: [""] }],
    },
  });

  const addVariation = () => {
    const newVariation = { name: "", options: [""] };
    setVariations([...variations, newVariation]);
    form.setValue("variations", [...variations, newVariation]);
  };

  const removeVariation = (index) => {
    const newVariations = variations.filter((_, i) => i !== index);
    setVariations(newVariations);
    form.setValue("variations", newVariations);
  };

  const addOption = (variationIndex) => {
    const newVariations = [...variations];
    newVariations[variationIndex].options.push("");
    setVariations(newVariations);
    form.setValue("variations", newVariations);
  };

  const removeOption = (variationIndex, optionIndex) => {
    const newVariations = [...variations];
    newVariations[variationIndex].options = newVariations[variationIndex].options.filter((_, i) => i !== optionIndex);
    setVariations(newVariations);
    form.setValue("variations", newVariations);
  };

  const updateVariationName = (index, value) => {
    const newVariations = [...variations];
    newVariations[index].name = value;
    setVariations(newVariations);
    form.setValue("variations", newVariations);
  };

  const updateOption = (variationIndex, optionIndex, value) => {
    const newVariations = [...variations];
    newVariations[variationIndex].options[optionIndex] = value;
    setVariations(newVariations);
    form.setValue("variations", newVariations);
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    try {
      // Validate variations
      const validVariations = variations.filter(
        (variation) =>
          variation.name.trim() && variation.options.some((opt) => opt.trim())
      );

      if (validVariations.length === 0) {
        setSubmitStatus({
          type: "error",
          message: "At least one variation with a name and option is required",
        });
        return;
      }

      const result = await updateProduct(product._id, { ...values, variations: validVariations });

      if (result.success) {
        toast.success("Product updated successfully!");
        router.push("/seller/products");
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "Failed to update product",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Product Name */}
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Enter product name"
                className="mt-1"
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Base Price */}
            <div>
              <Label htmlFor="basePrice">Base Price</Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                {...form.register("basePrice")}
                placeholder="Enter base price"
                className="mt-1"
              />
              {form.formState.errors.basePrice && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.basePrice.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Enter product description"
                rows={4}
                className="mt-1"
              />
              {form.formState.errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            {/* Variations */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Product Variations</Label>
                <Button
                  type="button"
                  onClick={addVariation}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variation
                </Button>
              </div>

              <div className="space-y-4">
                {variations.map((variation, variationIndex) => (
                  <Card key={variationIndex} className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <Input
                        placeholder="Variation name (e.g., Size, Color)"
                        value={variation.name}
                        onChange={(e) => updateVariationName(variationIndex, e.target.value)}
                        className="flex-1 mr-2"
                      />
                      <Button
                        type="button"
                        onClick={() => removeVariation(variationIndex)}
                        variant="destructive"
                        size="sm"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Options</Label>
                      <div className="flex flex-wrap gap-2">
                        {variation.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-2">
                            <Input
                              placeholder="Option (e.g., Small, Red)"
                              value={option}
                              onChange={(e) => updateOption(variationIndex, optionIndex, e.target.value)}
                              className="w-32"
                            />
                            {variation.options.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeOption(variationIndex, optionIndex)}
                                variant="outline"
                                size="sm"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          onClick={() => addOption(variationIndex)}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Submit Status */}
            {submitStatus.message && (
              <div
                className={`p-4 rounded-md ${
                  submitStatus.type === "error"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Updating..." : "Update Product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/seller/products")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProductForm;

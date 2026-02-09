"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import CustomDialog from "./Dialog";
import { FaTrashCan, FaPen } from "react-icons/fa6";
import { deleteProduct } from "@/app/action/ProductAction";

const ProductActions = ({ product }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      console.log("Attempting to delete product:", product.id);

      const result = await deleteProduct(product.id);
      console.log("Delete result:", result);

      if (result.status === "success") {
        toast.success("Product deleted successfully");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Link
        href={`/seller/products/edit/${product.id}`}
        className="text-sm px-4 py-2 text-teal-600 items-center gap-3 inline-flex hover:bg-teal-50 rounded transition-colors"
      >
        <FaPen /> <span>Edit</span>
      </Link>
      <CustomDialog
        title="Delete Product"
        description={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
      >
        <button
          className="px-4 py-2 bg-red-600 text-sm text-white inline-flex items-center gap-3 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
          disabled={isDeleting}
        >
          <FaTrashCan /> <span>{isDeleting ? "Deleting..." : "Delete"}</span>
        </button>
      </CustomDialog>
    </div>
  );
};

export default ProductActions;

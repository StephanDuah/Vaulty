"use client";
import React from "react";
import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import CustomDialog from "./Dialog";
import { displayCurrency } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const columns = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "amount",
    header: "Price",
    cell: ({ row }) => {
      const amount = row.getValue("amount");
      const formatted = displayCurrency(amount);

      return <div className="text-gray-800 text-lg">{formatted}</div>;
    },
  },
  { accessorKey: "productCode", header: "Product Code" },

  {
    accessorKey: "variations",
    header: "Variations",
    cell: ({ row }) => {
      const variations = row.getValue("variations");
      console.log(variations);

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <span className="mr-1">{variations.length}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-3">
            <h3 className="font-medium mb-2">Product Variations</h3>
            <div className="flex flex-col flex-wrap gap-1">
              {variations.map((variation, index) => (
                <div className="flex items-center gap-1 flex-wrap" key={index}>
                  <p>{variation.name}</p>
                  {variation.options.map((item, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex gap-2 items-center">
          <Link className="text-sm px-4 py-2 text-teal-600" href="/">
            Edit
          </Link>
          <button className="px-4 py-2 bg-red-600 text-sm text-white rounded-full">
            Delete
          </button>
        </div>
      );
    },
  },
];

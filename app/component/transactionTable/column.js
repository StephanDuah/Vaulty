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

import { FaTrashCan, FaPen } from "react-icons/fa6";
export const columns = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Id
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  { accessorKey: "buyer", header: "From" },
  { accessorKey: "totalAmount", header: "Amount" },
  { accessorKey: "status", header: "Status" },

  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <Link
          className="text-sm px-4 py-2 text-primary items-center gap-3 inline-flex"
          href={`Transaction/${transaction.id}`}
        >
          <span>View</span>
        </Link>
      );
    },
  },
];

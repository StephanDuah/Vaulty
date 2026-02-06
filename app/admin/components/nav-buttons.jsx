"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NavButtons = ({ children, link }) => {
  const pathname = usePathname();
  const isActive = pathname === link;
  return (
    <Link
      href={link}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-blue-500 text-white shadow-md"
          : "text-white/80 hover:bg-white/10 hover:text-white"
      )}
    >
      {children}
    </Link>
  );
};

export default NavButtons;

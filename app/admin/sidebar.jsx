import React from "react";
import Link from "next/link";
import {
  Users,
  FileText,
  Briefcase,
  LayoutDashboard,
  Shield,
} from "lucide-react";
import NavButtons from "./components/nav-buttons";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  { id: "users", label: "Users", icon: Users, path: "/admin/dashboard/users" },
  {
    id: "verification",
    label: "Verification",
    icon: Shield,
    path: "/admin/dashboard/verification",
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: FileText,
    path: "/admin/dashboard/transactions",
  },
  {
    id: "escrows",
    label: "Escrows",
    icon: Briefcase,
    path: "/admin/dashboard/escrows",
  },
];

const Sidebar = () => {
  return (
    <aside className="w-[280px] h-screen bg-[#1e3a5f] fixed top-0 left-0 bottom-0 flex flex-col shadow-xl z-40">
      <div className="p-6 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-white shadow-md">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            TrustVault
          </span>
        </Link>
        <p className="text-xs text-white/70 mt-1 ml-11">Admin Panel</p>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavButtons key={item.id} link={item.path}>
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </NavButtons>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10">
        <p className="text-xs text-white/60 px-3">TrustVault Admin v1</p>
      </div>
    </aside>
  );
};

export default Sidebar;

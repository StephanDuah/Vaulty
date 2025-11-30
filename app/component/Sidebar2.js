import React from "react";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  BarChartIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SettingsIcon,
  UsersIcon,
  BellIcon,
  MenuIcon,
} from "lucide-react";
import Link from "next/link";
import { Item } from "@radix-ui/react-accordion";

import LogoutButton from "./LogoutButton";
import Asidebar from "./seller/Asidebar";
import { getUserDetailsByEmail } from "../action/UserActions";
import { auth } from "@/auth";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/seller",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Products",
      url: "/seller/products",
      icon: ListIcon,
    },
    {
      title: "Analytics",
      url: "/seller/analytics",
      icon: BarChartIcon,
    },
    {
      title: "Transaction",
      url: "/seller/transaction",
      icon: FolderIcon,
    },
    {
      title: "Team",
      url: "#",
      icon: UsersIcon,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
  ],
};

const Sidebar2 = async ({ children }) => {
  const session = await auth();
  const user = await getUserDetailsByEmail(session.user.email);

  return (
    <section className="w-full relative bg-gray-100/30 min-h-screen h-full">
      {/* Sidebar */}
      <Asidebar>
        <div className=" w-full flex  items-center space-x-5 justify-end px-2 md:px-10">
          <BellIcon className="h-4 w-4" />
          <ProfileBar user={user} />
        </div>
      </Asidebar>
      <main className="ml-0 lg:ml-[250px] mt-[80px] p-6 bg-slate-50 min-h-screen">
        {children}
      </main>
    </section>
  );
};

export default Sidebar2;

const ProfileBar = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none flex items-center gap-2 cursor-pointer">
        <span>
          {user.firstName} {user.lastName}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px]">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link className="w-full h-full" href={"/seller/profile"}>
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

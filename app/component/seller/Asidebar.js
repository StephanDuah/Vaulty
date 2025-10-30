"use client";
import React from "react";
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

import { usePathname } from "next/navigation";

import { useState } from "react";
import Icon from "../icon";

const NavData = {
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
const Asidebar = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <aside
        className={`${
          open ? "left-0" : "left-[-300px] transition-all duration-200 ease-in"
        }  w-[250px] h-screen fixed left-0 top-0 md:left-0  bg-white lg:bg-gradient-to-b from-white to-secondary/10 shadow-md z-20 text-center `}
      >
        <h1 className="text-blue-800 text-2xl font-bold py-4 text-center flex justify-center">
          <Icon />
        </h1>
        <div className="flex flex-col h-full justify-between px-5 pt-10 pb-20">
          <NavLinks items={NavData.navMain} setOpen={setOpen} />
          <NavLinks items={NavData.navSecondary} setOpen={setOpen} />
        </div>
      </aside>

      {/* Header */}
      <header className="z-10 px-10 py-6 bg-white fixed top-0 right-0 left-0 md:left-[250px] shadow-md flex items-center justify-between">
        <button className="block md:hidden" onClick={() => setOpen(true)}>
          <MenuIcon />
        </button>
        <div className=" w-full flex  items-center space-x-5 justify-end px-2 md:px-10">
          {children}
        </div>
      </header>
      <div
        className={`${
          !open ? "hidden" : "block"
        } w-full lg:hidden h-screen bg-black/10 absolute top-0 bottom-0 left-0`}
        onClick={() => setOpen(false)}
      ></div>
    </>
  );
};

export default Asidebar;

const NavLinks = ({ items, setOpen }) => {
  const pathname = usePathname();
  return (
    <ul className="space-y-4">
      {items.map((link) => (
        <li key={link.title}>
          <Link
            href={link.url}
            onClick={() => setOpen(false)}
            className={`flex items-center space-x-2   rounded-xl text-sm py-2 text-center  px-4 ${
              link.url === pathname
                ? "bg-primary text-white s"
                : "text-gray-800"
            } transition duration-150`}
          >
            {link.icon ? <link.icon className="h-4 w-4" /> : ""}
            <span>{link.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

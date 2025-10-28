import React from "react";
import SideBarlayout from "../component/seller/sidebar";
import Provider from "../Context/ThemeProvider";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar2 from "../component/Sidebar2";
import { SessionProvider } from "next-auth/react";

const TransactionDashboard = async ({ children }) => {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }
  return (
    <SessionProvider>
      <Provider>
        <Sidebar2>{children}</Sidebar2>
      </Provider>
    </SessionProvider>
  );
};

export default TransactionDashboard;

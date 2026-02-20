import React from "react";
import UsersPage from "./users-table";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/database";
import {
  getAllUser,
  getPendingVerificationUsers,
} from "@/app/action/UserActions";

export const dynamic = "force-dynamic";

const page = async () => {
  await connectDB();

  // Get all users for the table
  const allusers = await getAllUser();

  // Get pending verification users for highlighting
  const pendingUsers = await getPendingVerificationUsers();

  return <UsersPage allusers={allusers} pendingUsers={pendingUsers} />;
};

export default page;

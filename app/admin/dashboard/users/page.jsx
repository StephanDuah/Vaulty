import React from "react";
import UsersPage from "./users-table";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/database";
import { getAllUser } from "@/app/action/UserActions";

const page = async () => {
  await connectDB();
  const user = await getAllUser();
  return <UsersPage allusers={user} />;
};

export default page;

"use server";
import { updateTag } from "next/cache";
import { connectDB } from "@/lib/database";
import User from "@/lib/models/User";

export const getAdminStats = async () => {
  await connectDB();
  const [totalUsers, pendingUsers, verifiedUsers] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ verification: "pending" }),
    User.countDocuments({ verification: "verified" }),
  ]);
  return { totalUsers, pendingUsers, verifiedUsers };
};

export const verifyUser = async (id) => {
  await connectDB();
  try {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    user.verification = "verified";
    await user.save();
    updateTag("user");
    return { status: true, message: "verification complete" };
  } catch (error) {
    console.log(error);
  }
};

export const deleteAllUser = async (id) => {
  await connectDB();
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new Error("User not found");

    return { status: "success", message: "user successfully deleted" };
  } catch (error) {
    console.log(error);
    console.log("something went wrong");
  }
};

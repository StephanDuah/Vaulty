import React from "react";
import { auth } from "@/auth";
import { connectDB } from "@/lib/database";
import User from "@/lib/models/User";
import NotificationList from "@/app/component/notifications/NotificationList";

const page = async () => {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  await connectDB();
  const user = await User.findById(session.user.id);
  
  if (!user || user.role !== "seller") {
    redirect("/seller/products");
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-gray-600">Stay updated on your account activity and verification status</p>
      </div>
      
      <NotificationList 
        userId={session.user.id} 
        role="seller"
        title="Your Notifications"
        showFilters={true}
      />
    </div>
  );
};

export default page;

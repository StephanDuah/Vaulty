import LoginForm from "@/app/component/auth/LoginForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await auth();
  if (session) return redirect("/seller");
  return (
    <div className="w-full flex justify-center items-center  ">
      <LoginForm />
    </div>
  );
};

export default page;

import React from "react";
import QrcodeGenerator from "../QrcodeGenerator";
import { auth } from "@/auth";
import { getUserDetailsByEmail } from "@/app/action/UserActions";

const BussinessCard = async () => {
  const { user } = await auth();
  const selectedUser = await getUserDetailsByEmail(user?.email);
  if (!selectedUser) {
    throw new Error("Something Went Wrong");
  }

  return (
    <div className="w-full p-5 lg:py-5 lg:px-36 bg-primary rounded-2xl space-y-10 text-white flex flex-col lg:flex-row items-center justify-between">
      <div className="space-y-3">
        <h4 className="text-3xl font-bold ">
          Welcome {selectedUser.firstName} {selectedUser.lastName}
        </h4>
        <p className=" capitalize">
          <span>Business name:</span> <span>{selectedUser.businessName}</span>
        </p>
        <div>
          <span>Checkout link:</span>
          <span>{`${process.env.BaseUrl}/checkout/${selectedUser.slug}`}</span>
        </div>
      </div>
      <QrcodeGenerator
        link={`${process.env.BaseUrl}/checkout/${selectedUser.slug}`}
      />
    </div>
  );
};

export default BussinessCard;

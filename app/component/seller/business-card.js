import React from "react";
import QrcodeGenerator from "../QrcodeGenerator";
import { auth } from "@/auth";
import { getUserDetailsByEmail } from "@/app/action/UserActions";
import CopyLink from "./CopyLInk";
import ShareButtons from "../SocialMediaButton";

const BussinessCard = async () => {
  const { user } = await auth();
  const selectedUser = await getUserDetailsByEmail(user?.email);
  if (!selectedUser) {
    throw new Error("Something Went Wrong");
  }

  return (
    <div className="w-full p-5 lg:py-3 lg:px-36 bg-primary rounded-2xl space-y-10 text-white flex flex-col lg:flex-row items-center justify-between">
      <div className="space-y-5">
        <h4 className="text-3xl font-bold ">
          Welcome {selectedUser.firstName} {selectedUser.lastName}
        </h4>
        <p className=" capitalize">
          <span>Business name:</span> <span>{selectedUser.businessName}</span>
        </p>
        <ShareButtons
          url={`${process.env.BASEURL}/checkout?business=${selectedUser.slug}`}
          title={"Trust Vault Checkout"}
        />
        <div>
          <span>Checkout link:</span>
          <div className="bg-white/5 flex p-4 py-2 rounded-full space-x-9">
            <div>
              {" "}
              {`${process.env.BASEURL}/checkout?business=${selectedUser.slug}`}
            </div>
            <CopyLink
              text={`${process.env.BASEURL}/checkout?business=${selectedUser.slug}`}
            />
          </div>
        </div>
      </div>
      <QrcodeGenerator
        link={`${process.env.BASEURL}/checkout?business=${selectedUser.slug}`}
      />
    </div>
  );
};

export default BussinessCard;

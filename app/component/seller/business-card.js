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
    <div className="w-full p-5 lg:py-10 lg:px-20 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-2xl shadow-lg space-y-10 text-white flex flex-col lg:flex-row items-center justify-between">
      <div className="space-y-5">
        <h4 className="text-3xl font-bold ">
          Welcome {selectedUser.firstName} {selectedUser.lastName}
        </h4>
        <p className=" capitalize">
          <span>Business name:</span> <span>{selectedUser.businessName}</span>
        </p>

        {/* Check if seller is verified */}
        {selectedUser.professionalVerification?.status !== "verified" ? (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
            <p className="text-red-100 text-sm font-medium">
              ⚠️ Your account is not verified. You must complete professional
              verification to start selling and receive payments.
            </p>
            <p className="text-red-200 text-xs mt-2">
              Please verify your account to enable checkout links and payment
              processing.
            </p>
          </div>
        ) : (
          <>
            <ShareButtons
              url={`${process.env.BASEURL}/checkout?business=${selectedUser.slug}`}
              title={"Trust Vault Checkout"}
            />
            <div>
              <span>Checkout link:</span>
              <div className="bg-white/5 flex p-4 py-2 rounded-full space-x-9 text-xs md:text-lg">
                <div>
                  {" "}
                  {`${process.env.BASEURL}/checkout?business=${selectedUser.slug}`}
                </div>
                <CopyLink
                  text={`${process.env.BASEURL}/checkout?business=${selectedUser.slug}`}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Only show QR code if seller is verified */}
      {selectedUser.professionalVerification?.status === "verified" && (
        <QrcodeGenerator
          link={`${process.env.BASEURL}/checkout?business=${selectedUser.slug}`}
        />
      )}
    </div>
  );
};

export default BussinessCard;

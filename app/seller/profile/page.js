import BagdeComponent from "@/app/component/Bagde";
import EditProfile from "@/app/component/EditProfile";
import ImagePicker from "@/app/component/ImagePicker";
import ProfessionalVerification from "@/app/component/ProfessionalVerification";
import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { connectDB } from "@/lib/database";
import User from "@/lib/models/User";
import { Coins, CheckCircle } from "lucide-react";
import React from "react";
import VerificationStatus from "@/app/component/VerificationStatus";

const page = async () => {
  await connectDB();
  const session = await auth();
  const user = await User.findById(session.user.id).lean();
  const santizedUser = JSON.parse(JSON.stringify(user));

  return (
    <div className="px-0 lg:px-32 flex-col space-y-5">
      <ProfileCard user={santizedUser} />
      <VerificationCard type={santizedUser.verification} id={session.user.id} />
      <VerificationStatus
        verification={santizedUser.verification || "not_verified"}
        showActions={true}
      />
      <ProfessionalVerification
        userId={session.user.id}
        professionalVerification={santizedUser.professionalVerification || {}}
      />
      <EditProfile user={santizedUser} />
    </div>
  );
};

const ProfileCard = ({ user }) => {
  return (
    <Card className="flex w-100 p-5 flex-col md:flex-row items-center">
      <div className="flex flex-col space-y-4 text-center md:text-left">
        <p className="text-xl lg:text-3xl font-extrabold">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-xl text-gray-400">{user.businessName}</p>
        <div className="flex space-x-2">
          <BagdeComponent
            title={`${user.escrowScore} points`}
            icon={<Coins />}
            className="text-blue-600 bg-blue-100 "
          />
          <BagdeComponent
            title={"Profile Completed"}
            icon={<CheckCircle />}
            className="text-green-600 bg-green-100 "
          />
        </div>
        <div className="flex">
          <span className="flex rounded-full py-2 px-6"></span>
        </div>
      </div>
    </Card>
  );
};

const VerificationCard = ({ type, id }) => {
  switch (type) {
    case "verification":
      return (
        <Card className="flex flex-col p-5 space-y-5">
          <div className="flex justify-between items-center">
            {" "}
            <p className="text-lg md:text-xl font-bold text-gray-600">
              Identity Verification
            </p>
            <BagdeComponent
              title={"Pending Review"}
              icon={<Coins />}
              className="text-white bg-blue-500 text-sm md:text-md"
            />
          </div>
          <div className="bg-gray-100/80 w-100 rounded-lg py-5 px-4 ">
            <p className="text-gray-600">ID Type</p>
            <p className="font-bold text-gray-600 text-xl">Ghana_card</p>
          </div>
          <div className="bg-blue-100/80 w-100 rounded-lg py-5 px-4 ">
            <p className="text-blue-800 font-bold ">Under Review</p>
            <p className=" text-blue-600">
              We re verifying your document. This usually take takes 24-48
              hours.
            </p>
            <ImagePicker id={id} type={"Ghana Card"} />
          </div>
        </Card>
      );
    case "failed":
      return (
        <Card className="flex flex-col p-5 space-y-5">
          <div className="flex justify-between items-center">
            <p className="text-xl md:text-2xl font-bold text-gray-600">
              Identity Verification
            </p>
            <BagdeComponent
              title={"Pending Review"}
              icon={<Coins />}
              className="text-white bg-red-500 text-sm md:text-md"
            />
          </div>

          <div className="bg-red-100/80 w-100 rounded-lg py-5 px-4 ">
            <p className="text-red-800 font-bold ">Under Review</p>
            <p className=" text-red-600">
              We re verifying your document. This usually take takes 24-48
              hours.
            </p>
          </div>
        </Card>
      );
    case "pending":
      return (
        <Card className="flex flex-col p-5 space-y-5">
          <div className="flex justify-between items-center">
            {" "}
            <p className="text-lg md:text-xl font-bold text-gray-600">
              Identity Verification
            </p>
            <BagdeComponent
              title={"Pending Review"}
              icon={<Coins />}
              className="text-white bg-orange-500 text-sm md:text-md"
            />
          </div>
          <div className="bg-gray-100/80 w-100 rounded-lg py-5 px-4 ">
            <p className="text-gray-600">ID Type</p>
            <p className="font-bold text-gray-600 text-lg">Ghana_card</p>
          </div>
          <div className="bg-yellow-100/80 w-100 rounded-lg py-5 px-4 ">
            <p className="text-yellow-800 font-bold ">Under Review</p>
            <p className=" text-yellow-600">
              We re verifying your document. This usually take takes 24-48
              hours.
            </p>
          </div>
        </Card>
      );
    case "verified":
      return (
        <Card className="flex flex-col p-5 space-y-5">
          <div className="flex justify-between items-center">
            {" "}
            <p className="text-xl md:text-2xl font-bold text-gray-600">
              Identity Verified
            </p>
            <BagdeComponent
              title={"Verified"}
              icon={<Coins />}
              className="text-white bg-green-500 text-sm md:text-md"
            />
          </div>
          <div className="bg-gray-100/80 w-100 rounded-lg py-5 px-4 ">
            <p className="text-gray-600">ID Type</p>
            <p className="font-bold text-gray-600 text-xl">Ghana_card</p>
          </div>
          <div className="bg-green-100/80 w-100 rounded-lg py-5 px-4 ">
            <p className="text-green-800 font-bold ">Under Review</p>
            <p className=" text-green-600">
              We re verifying your document. This usually take takes 24-48
              hours.
            </p>
          </div>
        </Card>
      );
  }
};

export default page;

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
import DeleteAccount from "@/app/component/DeleteAccount";

const page = async () => {
  await connectDB();
  const session = await auth();
  const user = await User.findById(session.user.id).lean();
  const santizedUser = JSON.parse(JSON.stringify(user));

  return (
    <div className="px-0 lg:px-32 flex-col space-y-5">
      <ProfileCard user={santizedUser} />
      <VerificationStatus
        verification={santizedUser.verification || "not_verified"}
        showActions={true}
      />
      <ProfessionalVerification
        userId={session.user.id}
        userVerification={santizedUser.verification}
        professionalVerification={santizedUser.professionalVerification || {}}
      />
      <EditProfile user={santizedUser} />

      {/* Account Management Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Account Management</h3>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Danger Zone</h4>
            <p className="text-sm text-gray-600 mb-4">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
            <DeleteAccount />
          </div>
        </div>
      </Card>
    </div>
  );
};

const ProfileCard = ({ user }) => {
  if (!user) {
    return (
      <Card className="w-full p-8 text-center">
        <div className="text-gray-500">User profile not available</div>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl">
      <div className="bg-primary h-32 py-4"></div>
      <div className="px-8 pb-8 -mt-16">
        <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
          {/* Profile Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-white shadow-lg border-4 border-white flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold">
                {user.firstName?.[0] || "U"}
                {user.lastName?.[0] || "N"}
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-1">
              {user.firstName || "Unknown"} {user.lastName || "User"}
            </h1>
            <p className="text-lg text-white mb-4">
              {user.businessName || "Professional Seller"}
            </p>

            {/* Stats and Badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  user.verification === "Verified"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Coins className="w-4 h-4 mr-2" />
                {user.verification === "Verified"
                  ? user.escrowScore || 0
                  : 0}{" "}
                Points
              </div>
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  user.verification === "Verified"
                    ? "bg-green-100 text-green-700"
                    : user.verification === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : user.verification === "Failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                }`}
              >
                {user.verification === "Verified" ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verified
                  </>
                ) : user.verification === "Pending" ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                    Pending
                  </>
                ) : user.verification === "Failed" ? (
                  <>
                    <div className="w-4 h-4 mr-2 bg-red-500 rounded-full"></div>
                    Failed
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 mr-2 bg-gray-500 rounded-full"></div>
                    Not Verified
                  </>
                )}
              </div>
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  user.verification === "Verified"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <div
                  className={`w-2 h-2 mr-2 rounded-full ${
                    user.active ? "bg-purple-500" : "bg-gray-500"
                  }`}
                ></div>
                {user.verification === "Verified" ? "Active" : "Inactive"}
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-white/80">
              <div className="flex items-center">
                <span className="font-medium">Member since:</span>
                <span className="ml-2">
                  {user.createdAt
                    ? new Date(user.createdAt).getFullYear()
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Email:</span>
                <span className="ml-2">{user.email || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
            <div
              className={`text-2xl font-bold ${
                user.verification === "Verified"
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            >
              {user.verification === "Verified" ? user.escrowScore || 0 : 0}
            </div>
            <div className="text-sm text-gray-600">Trust Score</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
            <div
              className={`text-2xl font-bold ${
                user.verification === "Verified"
                  ? "text-green-600"
                  : user.verification === "Pending"
                    ? "text-yellow-600"
                    : user.verification === "Failed"
                      ? "text-red-600"
                      : "text-gray-400"
              }`}
            >
              {user.verification === "Verified"
                ? "100%"
                : user.verification === "Pending"
                  ? "75%"
                  : user.verification === "Failed"
                    ? "50%"
                    : "0%"}
            </div>
            <div className="text-sm text-gray-600">Completion</div>
          </div>
          <div
            className={`bg-white rounded-lg p-4 text-center border border-gray-200`}
          >
            <div
              className={`text-2xl font-bold ${
                user.verification === "Verified"
                  ? "text-purple-600"
                  : "text-gray-400"
              }`}
            >
              {user.verification === "Verified" ? "Active" : "Inactive"}
            </div>
            <div className="text-sm text-gray-600">Status</div>
          </div>
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
              {`Sorry We couldn't verify your document. Contact support for help.`}
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
              Your document has been verified. You can now start selling.
            </p>
          </div>
        </Card>
      );
  }
};

export default page;

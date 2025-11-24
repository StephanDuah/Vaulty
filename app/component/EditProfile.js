"use client";
import { Card } from "@/components/ui/card";
import { FaFloppyDisk, FaUserPen } from "react-icons/fa6";
import React, { useActionState, useState } from "react";
import { updateSeller } from "../action/UserActions";
const EditProfile = ({ user }) => {
  const initialState = {
    type: "",
    message: "",
    values: user,
  };

  const updateUserWithId = updateSeller.bind(null, user._id);
  const [state, formAction, pending] = useActionState(
    updateUserWithId,
    initialState
  );
  return (
    <Card className="flex flex-col p-5 space-y-8">
      {state.type && state.type === "success" ? (
        <p className="text-green-500">{state.message}</p>
      ) : (
        <p className="text-red-500">{state.message}</p>
      )}
      <div className="flex items-center space-x-3">
        <FaUserPen className="h-8 w-8 text-blue-500" />
        <p className="text-lg font-bold text-gray-600">Edit Profile</p>
      </div>
      <form className="space-y-6" action={formAction}>
        {/* Full Name and Username Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder={state?.values?.firstName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder={state?.values?.lastName}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name
          </label>
          <input
            type="text"
            name="businessName"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            placeholder={state?.values?.businessName}
          />
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            placeholder={state?.values?.email}
          />
        </div>

        {/* Mobile Money Number and Location Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Money Number
            </label>
            <input
              type="tel"
              name="mobileNumber"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder={state?.values?.phoneNo}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              placeholder="E.g., Accra, Ghana"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            placeholder="E.g., Accra, Ghana"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <button
          type="submit"
          className="flex items-center space-x-1 text-lg bg-blue-600 px-6 py-2 rounded-lg text-white"
        >
          <FaFloppyDisk className="h-4 w-4" /> <span>Save Changes</span>
        </button>
      </form>
    </Card>
  );
};

export default EditProfile;

import VerifyOTPPage from "@/app/component/auth/Verify-OTPPage";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading....</div>}>
      <VerifyOTPPage />
    </Suspense>
  );
};

export default page;

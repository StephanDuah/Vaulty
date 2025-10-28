import React, { Suspense } from "react";
import ProfileCard from "./seller/profile-card";
import RecentTransaction from "./seller/recentTransac-card";
import ShipNow from "./seller/shipNow-card";
import Wrapper from "./seller/dashboard-card";
import BussinessCard from "./seller/business-card";

const Content = () => {
  return (
    <section className="max-h-screen flex flex-col w-full p-0 lg:p-10 ">
      <div className="">
        <BussinessCard />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4 w-full ">
        <Suspense fallback={<div>loading Profile...</div>}>
          <ProfileCard />
        </Suspense>

        <Suspense fallback={<div>loading recent transactions</div>}>
          <RecentTransaction />
        </Suspense>
      </div>
      <Suspense fallback={<div>loading delayed transactions</div>}>
        <ShipNow />
      </Suspense>
    </section>
  );
};

export default Content;

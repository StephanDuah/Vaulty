import Video from "@/app/component/Video";
import React from "react";

const Maintanance = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center ">
      <div>
        <Video src={"/videos/construction.mp4"} type={"video/mp4"} />
      </div>
      <div className="text-2xl font-bold text-gray-800 mt-4">
        This page are currently under construction.
      </div>
      <div className="text-lg text-gray-600 mt-2">
        We are working hard to bring you the best experience.{" "}
      </div>
    </div>
  );
};

export default Maintanance;

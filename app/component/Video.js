import React from "react";

const Video = ({ src, type }) => {
  return (
    <video
      className=" flex flex-col items-center justify-center"
      autoPlay
      loop
      muted
      width="800"
      height="400"
      src={src}
      type={type}
    ></video>
  );
};

export default Video;

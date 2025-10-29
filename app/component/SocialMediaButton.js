"use client";
import React from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";

const ShareButtons = ({ url, title }) => {
  return (
    <div className="flex items-center gap-2">
      <FacebookShareButton url={url} quote={title}>
        <FacebookIcon size={40} round />
      </FacebookShareButton>

      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={40} round />
      </TwitterShareButton>

      <WhatsappShareButton url={url} title={title} separator=" - ">
        <WhatsappIcon size={40} round />
      </WhatsappShareButton>
    </div>
  );
};

export default ShareButtons;

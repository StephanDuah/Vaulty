"use client";
import React, { useState } from "react";
import { CopyIcon, Check } from "lucide-react";
const CopyLink = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <button onClick={handleCopy} className="flex items-center">
      {copied ? (
        <>
          {" "}
          <Check />
        </>
      ) : (
        <>
          {" "}
          <CopyIcon />
        </>
      )}
    </button>
  );
};

export default CopyLink;

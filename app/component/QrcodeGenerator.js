"use client";
import React from "react";
import { QRCodeSVG } from "qrcode.react";
const QrcodeGenerator = ({ link }) => {
  return (
    <QRCodeSVG
      value={link}
      title="Trustvault Checkout"
      level="H"
      marginSize={1}
    />
  );
};

export default QrcodeGenerator;

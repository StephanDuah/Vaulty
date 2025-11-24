"use client";
import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { ArrowDownCircle } from "lucide-react";

const QrcodeGenerator = ({ link }) => {
  const qrRef = React.useRef();

  const downloadQRCode = () => {
    const canvas = qrRef.current;
    const url = canvas.toDataURL("image/png"); // capital URL!
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <div className="space-y-3 flex flex-col justify-center items-center">
      <QRCodeCanvas
        ref={qrRef}
        value={link}
        title="Trustvault Checkout"
        level="H"
        marginSize={1}
        size={100}
      />
      <button
        className="flex items-center bg-slate-50 py-2 px-4 text-xs font-semibold space-x-2 rounded-full text-primary"
        onClick={downloadQRCode}
      >
        <div>Download qr-code</div> <ArrowDownCircle />
      </button>
    </div>
  );
};

export default QrcodeGenerator;

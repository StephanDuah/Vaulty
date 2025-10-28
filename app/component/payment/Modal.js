import { Card } from "@/components/ui/card";
import React from "react";
import loading2 from "@/public/images/payments/loading2.gif";
import Image from "next/image";

const Modal = ({ loading, response, onClose }) => {
  // Only render if loading or message is present
  if (!loading || !response) return null;
  const { status, message } = response;

  return (
    <section className="absolute flex items-center justify-center w-full h-screen bg-black/55 z-10">
      <Card className="w-[500px] h-[600px] flex flex-col items-center justify-center relative">
        <button
          className="absolute right-0 top-0 p-2"
          onClick={onClose} // Add onClick handler
        >
          close
        </button>
        {loading ? (
          <>
            <Image
              src={loading2}
              alt="loading"
              height={300}
              width={300}
              // Remove unoptimized if you want Next.js to optimize the image
            />
            <h3 className="text-lg font-semibold mt-4">Processing...</h3>
          </>
        ) : (
          <>
            {status === "success" && (
              <h3 className="text-lg font-semibold text-green-600">
                {message}
              </h3>
            )}
            {status === "error" && (
              <h3 className="text-lg font-semibold text-red-600">{message}</h3>
            )}
          </>
        )}
      </Card>
    </section>
  );
};

export default Modal;

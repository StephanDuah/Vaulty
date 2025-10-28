"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function OTPInput({
  length = 6,
  onComplete,
  disabled = false,
  error = false,
}) {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (disabled) return;

    // Only allow single digit
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when all fields are filled
    if (newOtp.every((digit) => digit !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (disabled) return;

    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, length);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < length; i++) {
      newOtp[i] = pastedData[i];
    }

    setOtp(newOtp);

    // Focus on the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();

    // Call onComplete if all fields are filled
    if (newOtp.every((digit) => digit !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            "transition-all duration-200",
            error
              ? "border-red-500 bg-red-50 text-red-900"
              : "border-gray-300 bg-white text-gray-900",
            disabled && "opacity-50 cursor-not-allowed bg-gray-100"
          )}
        />
      ))}
    </div>
  );
}

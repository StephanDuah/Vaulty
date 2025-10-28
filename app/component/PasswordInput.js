"use client";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState } from "react";

const PasswordInput = ({ className, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => {
    setShowPassword((prev) => !prev);
  };
  const type = showPassword ? "text" : "password";
  const Icon = showPassword ? EyeOffIcon : EyeIcon;
  return (
    <div className="relative">
      <Input type={type} className={className} {...props} />
      <button
        type="button"
        onClick={handleClick}
        className="absolute -translate-y-1/2 top-1/2 right-3"
      >
        <Icon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PasswordInput;

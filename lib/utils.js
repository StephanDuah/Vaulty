import { clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const displayCurrency = (amount) => {
  return `GH₵ ${amount.toFixed(2)} `;
};

export function generateUniqueId(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export function generateSecureOTP(length = 6) {
  let otp = "";
  for (let i = 0; i < length; i++) {
    const random = crypto.getRandomValues(new Uint32Array(1))[0] % 10;
    otp += random.toString();
  }
  return otp;
}

export function formatGhanaPhone(number) {
  // Ensure it's a string
  number = String(number).trim();

  // Remove spaces or dashes
  number = number.replace(/[\s-]/g, "");

  // If it starts with 0, drop it
  if (number.startsWith("0")) {
    number = number.slice(1);
  }

  // Add +233 at the beginning
  return "+233" + number;
}

export function formatDate(date) {
  return format(date, "do MMMM, yyyy");
}

const accountSid = process.env.TWILLIO_ACCOUNT_SID;
const authToken = process.env.TWILLIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILLIO_SERVICE_SID;

const client = require("twilio")(accountSid, authToken);
import axios from "axios";
import { formatGhanaPhone } from "../utils";
export async function sendSMS(body, to) {
  try {
    const message = await client.messages.create({
      body,
      from: "+12318803719",
      to: formatGhanaPhone(to),
    });
    console.log(`Message sent successfully. SID: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error(`Failed to send message: ${error.message}`);
    return { success: false, error: error.message };
  }
}

export const sendSuccessfulPayment = async (info, type) => {
  const {
    sellerNumber,
    buyerNumber,
    transactionId,
    totalAmount,
    buyerName,
    businessName,
    product,
    shippingDate,
  } = info;
  let message;
  let phoneNumber;
  console.log(buyerNumber);
  switch (type) {
    case "buyer":
      phoneNumber = formatGhanaPhone(buyerNumber);
      message = `TrustVault: Payment of GHS ${totalAmount} for items ${product} was successful. Funds are held in our vault till delivery. TxnId=${transactionId}`;
      break;
    case "seller":
      phoneNumber = formatGhanaPhone(sellerNumber);
      message = `TrustVault: Payment of GHS ${totalAmount} for items ${product} has been made into your Escrow Account by ${buyerName}. Please confirm shipment within ${shippingDate} for payment of funds. TxnId=${transactionId}`;
      break;
    default:
      break;
  }

  await sendMessage(phoneNumber, message);
};

export const sendSellerReminder = async (info) => {
  const { product, buyerName, shippingDate, totalAmount, sellerNumber } = info;
  let phoneNumber = formatGhanaPhone(sellerNumber);
  const message = `Please you must ship the products ${product} to ${buyerName} by the end of ${shippingDate} to receive an amount of GHS ${totalAmount}`;
  await sendMessage(phoneNumber, message);
};

export const sendBuyerReminder = async (phoneNumber) => {
  const message =
    "Hi Mr stephan a reminder has been sent to the seller to confirm shipment within two days or you will get your refund";
  await sendMessage(phoneNumber, message);
};

export const sendRefundMessageSeller = async (info) => {
  const { transactionId, totalAmount, sellerNumber } = info;
  let phoneNumber = formatGhanaPhone(sellerNumber);
  try {
    const message = `Due to your inability to confirm shipment of transaction ${transactionId}, the amount of ${totalAmount} has been refunded to the buyer. Please let us know if there was any problem as to why you could not complete the transaction`;
    await sendMessage(phoneNumber, message);
  } catch (error) {
    console.log(error);
  }
};

export const delayedReleaseMessageBuyer = async (info) => {
  const { buyerNumber, transactionId } = info;
  const phoneNumber = formatGhanaPhone(buyerNumber);
  const message = `Because you were unable to confirm delivery of shipment for transaction ${transactionId} in time, the money has been released to the seller. If there was any problem as to why you couldn't complete the transaction please let us know`;
  await sendMessage(phoneNumber, message);
};

export const sendShipmentMessage = async (info, type) => {
  const { sellerNumber, buyerNumber, code, businessName, transactionId } = info;
  let message;
  let phoneNumber;
  console.log(buyerNumber);
  switch (type) {
    case "buyer":
      phoneNumber = formatGhanaPhone(buyerNumber);
      message = `TrustVault: ${businessName} has confirmed shipment. Please confirm when the delivery is made to you for a successful transaction. Your verification code is ${code}. Please do not share it with anyone. Visit ${process.env.BASEURL}/delievery?transacId=${transactionId} to confirm delivery when your package arrives`;
      break;
    case "seller":
      phoneNumber = formatGhanaPhone(sellerNumber);
      message = `TrustVault: You have successfully made a confirmation of shipment of goods. Now sit back and watch the money roll in.`;
      break;
    default:
      break;
  }

  await sendMessage(phoneNumber, message);
};

export const sendSuccessfulTransaction = async (info, type) => {
  const {
    sellerNumber,
    buyerNumber,
    code,
    businessName,
    transactionId,
    totalAmount,
  } = info;
  let message;
  let phoneNumber;
  console.log(buyerNumber);
  switch (type) {
    case "buyer":
      phoneNumber = formatGhanaPhone(buyerNumber);
      message = `TrustVault: you did it`;
      break;
    case "seller":
      phoneNumber = formatGhanaPhone(sellerNumber);
      message = `TrustVault: you've just completed a transaction of ${totalAmount}`;
      break;
    default:
      break;
  }
  console.log(phoneNumber);
  await sendMessage(phoneNumber, message);
};
export const sendMessage = async (number, message) => {
  const raw = Array.isArray(number) ? number : [number];
  const phoneNumber = raw.map((n) => String(n).replace(/^\+/, ""));
  console.log(
    `message: ${message}, phoneNumber: ${phoneNumber}, APIKEY: ${process.env.ARKESELAPI}, URL: ${process.env.ARKESELURL}`,
  );

  if (!process.env.ARKESELURL || !process.env.ARKESELAPI) {
    const err = new Error("SMS not configured: set ARKESELURL and ARKESELAPI");
    console.error(err.message);
    throw err;
  }

  try {
    const dataMethod = {
      sender: "DeezyTech",
      message: message,
      recipients: phoneNumber,
      callback_url: "https://google.com",
    };
    const config = {
      method: "post",
      url: process.env.ARKESELURL,
      headers: {
        "api-key": process.env.ARKESELAPI,
        "Content-Type": "application/json",
      },
      data: dataMethod,
    };

    const response = await axios(config);
    const data = response?.data;
    const status = data?.status ?? data?.message ?? data?.code;
    if (response.status >= 200 && response.status < 300) {
      return status === "failed" || status === "error"
        ? (data?.message ?? "Failed")
        : "success";
    }
    throw new Error(data?.message ?? `SMS failed: ${response.status}`);
  } catch (error) {
    const msg =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message;
    console.error("SMS send failed:", msg);
    throw error;
  }
};

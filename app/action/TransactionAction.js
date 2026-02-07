"use server";

import { connectDB } from "@/lib/database";
import { sendShipmentMesaageToBuyer } from "@/lib/mailing/email";
import {
  sendSuccessfulPayment,
  sendShipmentMessage,
  sendSuccessfulTransaction,
} from "@/lib/mailing/sms";
import { sendHello, sendMessages, sendTemplate } from "@/lib/mailing/whatsapp";
import { Escrow } from "@/lib/models/Escrow";
import User from "@/lib/models/User";
import { formatDate, generateSecureOTP } from "@/lib/utils";

const { Transaction } = require("@/lib/models/Transaction");

const { requestToPay, releaseMoney } = require("@/lib/payment/collection-api");

export const createTransaction = async (data) => {
  await connectDB();

  try {
    if (!data) throw new Error("Something went wrong");

    const response = await requestToPay({
      amount: data.totalAmount,
      phoneNumber: data?.buyerDetail.phoneNumber,
    });

    console.log(data);
    if (response?.status === "SUCCESSFUL") {
      const transaction = await Transaction.create(data);
      const escrow = await Escrow.create({
        transactionId: transaction._id,
      });
      const user = await User.findOne({ _id: data.sellerId });
      let info = await getmessageInfo(
        transaction,
        user,
        escrow,
        transaction._id,
      );

      console.log(info);
      console.log("Sending messages....");
      await sendSuccessfulPayment(info, "buyer");
      await sendSuccessfulPayment(info, "seller");
      return { status: "success", message: "Payment made successfull" };
    }

    return { status: "error", message: "Transaction failed Try again later" };
  } catch (e) {
    console.log(e);
    return { status: "error", message: "Something went wrong Try again later" };
  }
};

export const getTransactions = async () => {
  await connectDB();
  try {
    const transactions = await Transaction.find({});
    console.log(formatDate(transactions.map((i) => i.createAt)));
    return JSON.parse(JSON.stringify(transactions));
  } catch (error) {
    console.log(error);
  }
};

export const getSellersTransaction = async (id) => {
  await connectDB();
  try {
    const transaction = await Transaction.find({ sellerId: id });
    console.log(transaction);
    return JSON.parse(JSON.stringify(transaction));
  } catch (error) {
    console.log(JSON.parse());
  }
};

export const confirmShipment = async (id) => {
  await connectDB();

  try {
    const transaction = await Transaction.findOne({ _id: id }).populate(
      "sellerId",
    );

    if (!transaction) {
      return { status: "Error", message: "Transaction not found" };
    }

    if (transaction.transactionStatus !== "pending") {
      return {
        status: "Error",
        message: "Transaction has already been processed",
      };
    }

    console.log("Confirming shipment...");
    const code = generateSecureOTP();
    transaction.confirmShippmentCode = code;
    transaction.transactionStatus = "shipped";
    transaction.shippingDate = new Date();
    await transaction.save();

    console.log("Preparing messages...");
    const info = await getmessageInfo(
      transaction,
      transaction.sellerId,
      null,
      transaction._id,
    );

    console.log("Sending notifications...");
    await Promise.all([
      sendShipmentMesaage({ code, ...info }, "buyer"),
      sendShipmentMesaage(info, "seller"),
    ]);

    return { status: "Success", message: "Product has been marked as shipped" };
  } catch (e) {
    console.error("Error confirming shipment:", e);
    return { status: "Error", message: "Something went wrong" };
  }
};

export const releasefund = async (id, code) => {
  await connectDB();
  try {
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      throw new Error("Transaction not found");
    }
    console.log(transaction.confirmShippmentCode);
    console.log(code);

    if (transaction.confirmShippmentCode !== code) {
      return {
        status: "error",
        message: "The code is invalid",
      };
    }
    const escrow = await Escrow.findOne({ transactionId: transaction._id });

    console.log(transaction.transactionStatus);

    if (transaction.transactionStatus === "pending") {
      return {
        status: "error",
        message: "Please wait for your merch to be shipped",
      };
    } else if (transaction.transactionStatus != "shipped") {
      return {
        status: "error",
        message: "Please wait for your merch to be shipped",
      };
    }

    if (escrow.status != "held") {
      throw new Error("Escrow is not held");
    }
    const user = await User.findOne({ _id: transaction.sellerId });
    if (!user) {
      throw new Error("User is not found");
    }
    console.log(user.phoneNo);
    const response = await releaseMoney({
      amount: transaction.totalAmount,
      phoneNumber: user.phoneNo,
    });

    if (response.status === "SUCCESSFUL") {
      escrow.status = "released";
      transaction.transactionStatus = "delievered";

      user.escrowScore += 300;
      escrow.releasedAt = Date.now();

      await transaction.save();
      await escrow.save();
      await user.save();

      const info = await getmessageInfo(
        transaction,
        user,
        escrow,
        transaction._id,
      );
      await sendSuccessfulTransaction(
        { totalAmount: transaction.totalAmount, ...info },
        "buyer",
      );
      await sendSuccessfulTransaction(
        { totalAmount: transaction.totalAmount, ...info },
        "seller",
      );

      return { status: "success", message: "Money has been released" };
    }
  } catch (error) {
    console.log(error);
  }
};

export const getmessageInfo = async (transaction, user, escrow, id) => {
  return {
    totalAmount: transaction?.totalAmount,
    product: transaction?.items.map((items) => items.itemCode).toString(),
    shippingDate: new Date(escrow?.heldAt + user.dtd * 24 * 60 * 60 * 1000),
    buyerName:
      transaction.buyerDetail?.firstName +
      " " +
      transaction?.buyerDetail.lastName,
    businessName: user?.businessName,
    sellerNumber: user?.phoneNo,
    buyerNumber: transaction?.buyerDetail.phoneNumber,
    transactionId: id,
  };
};

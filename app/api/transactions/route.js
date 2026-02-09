import { connectDB } from "@/lib/database";
import { checkBuyerDeadline, checkSellerDeadline } from "@/lib/logic";
import { getTransactionWithdeadline } from "@/lib/logic/transactions";
import { sendRefundMessageSeller } from "@/lib/mailing/email";
import { sendBuyerReminder, sendSMS } from "@/lib/mailing/sms";
import { sendHello } from "@/lib/mailing/whatsapp";
import User from "@/lib/models/User";
import { formatDate } from "@/lib/utils";
import { NextResponse } from "next/server";

const { Escrow } = require("@/lib/models/Escrow");
const { Transaction } = require("@/lib/models/Transaction");

export const GET = async (req) => {
  await connectDB();
  // console.log("sending message");

  // await sendSMS();
  // await sendHello();

  // const getEscrow = async (id) => {
  //   try {
  //     const escrow = await Escrow.findOne({ transactionId: id });
  //     return escrow;
  //   } catch (error) {
  //     console.log(error);
  //     return null;
  //   }
  // };

  try {
    // const transactions = await Transaction.find({});

    // const newFormat = await Promise.all(
    //   transactions.map(async (transac) => {
    //     if (transac.transactionStatus === "pending") {
    //       const escrow = await getEscrow(transac._id);
    //       const user = await User.findOne({ _id: transac.sellerId });
    //       if (escrow && escrow.status === "held") {
    //         const deadline = escrow.heldAt;
    //         console.log(escrow.heldAt);
    //         if (isNaN(deadline.getTime())) {
    //           console.error(`Invalid date for escrow: ${escrow.heldAt}`);
    //           return null;
    //         }

    //         console.log(user.dtd);
    //         deadline.setDate(deadline.getDate() + user.dtd + 2);
    //         console.log(deadline);
    //         return {
    //           id: transac._id,
    //           deadline: deadline.toISOString(),
    //           sellerId: transac.sellerId,
    //         };
    //       }
    //     }
    //     return null;
    //   })
    // );

    // Filter out null values
    // const filteredResults = newFormat.filter((item) => item !== null);
    const transactions = await Transaction.find({}).populate("sellerId");
    const date = transactions.map((id) => formatDate(id.createdAt));
    console.log(date);
    await checkSellerDeadline(transactions);
    await checkBuyerDeadline(transactions);
    console.log("This is a trigger message");
    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

import User from "../models/User.js";
import Product from "../models/product.js";
import { Transaction } from "../models/Transaction.js";
import { Escrow } from "../models/Escrow";
export const getProfile = async (userId) => {
  try {
    const user = await User.findById(userId);
    const EscrowScore = user.escrowScore;

    if (!user) {
      throw new Error("User not found");
    }

    const Amount = await Transaction.find({
      sellerId: userId,
      transactionStatus: "delievered",
    });

    const TotalAmount = Amount.reduce(
      (total, items) => total + items.totalAmount,
      0
    );

    //const products = await Product.find({ sellerId: userId });
    const TotalTransactions = await Transaction.countDocuments({
      sellerId: userId,
    });
    const PendingTransactions = await Transaction.countDocuments({
      sellerId: userId,
      transactionStatus: "pending",
    });
    const SuccessfullTransactions = await Transaction.countDocuments({
      sellerId: userId,
      transactionStatus: "delievered",
    });

    const FailedTransactions = await Transaction.countDocuments({
      sellerId: userId,
      transactionStatus: "cancelled",
    });

    return {
      TotalTransactions,
      PendingTransactions,
      SuccessfullTransactions,
      FailedTransactions,
      EscrowScore,
      TotalAmount,
    };
  } catch (error) {
    throw new Error("Error fetching user: " + error.message);
  }
};
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
export const sendOtp = async (phoneNumbers) => {
  const phoneNumber = Array.isArray(phoneNumbers)
    ? phoneNumbers
    : [phoneNumbers];
  const data = {
    sender: "TrustVaultWeb",
    message,
    recipients: phoneNumber,
  };
  const config = {
    headers: {
      "api-key": process.env.ARKESEL_API,
    },
  };
  try {
    const request = await axios.post(
      process.env.ARKESEL_BASE_URL,
      data,
      config
    );

    console.log(request.data);
    return request.status;
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const sendResetCode = async () => {
  try {
  } catch (error) {}
};

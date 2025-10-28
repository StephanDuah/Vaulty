import { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema(
  {
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    items: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
        baseprice: {
          type: Number,
          required: true,
          min: 0,
        },
        variations: [],
      },
    ],
    transactionStatus: {
      type: String,
      enum: ["pending", "shipped", "delievered", "cancelled"],
      default: "pending",
    },
    buyerDetail: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
    },
    shippingDate: {
      type: Date,
    },
    sellerReminderSent: {
      type: Boolean,
      default: false,
    },
    buyerReminderSent: {
      type: Boolean,
      default: false,
    },

    confirmShippmentCode: {
      type: String,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction =
  models.Transaction || model("Transaction", TransactionSchema);

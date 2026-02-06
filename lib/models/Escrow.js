import { Schema, model, models } from "mongoose";

const EscrowSchema = new Schema(
  {
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    status: {
      type: String,
      enum: ["held", "released", "refunded"],
      default: "held",
    },
    heldAt: {
      type: Date,
      default: Date.now,
    },
    releaseAt: {
      type: Date,
    },
    refundAt: {
      type: Date,
    },
    reputation: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Escrow = models.Escrow || model("Escrow", EscrowSchema);

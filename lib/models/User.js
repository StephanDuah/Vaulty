import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: { type: String, required: true },
    businessName: { type: String, required: true },
    slug: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    paymentLink: {
      type: String,
    },
    dtd: {
      type: Number,
      min: 1,
      default: 3,
    },
    escrowScore: {
      type: Number,
      default: 100,
      required: true,
    },
    location: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    identification: {
      type: {
        type: String,
      },
      picture: {
        imageName: { type: String },
        imageId: { type: String },
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    verification: {
      type: String,
      enum: ["verification", "pending", "failed", "verified"],
      default: "verification",
      required: true,
    },
    otp: {
      code: { type: String },
      expires: { type: Date },
    },
    professionalVerification: {
      profession: { type: String },
      businessName: { type: String },
      businessRegistration: { type: String },
      licenseNumber: { type: String },
      experience: { type: String },
      description: { type: String },
      documents: [
        {
          type: { type: String },
          name: { type: String },
          data: { type: String },
          uploadedAt: { type: Date },
        },
      ],
      submittedAt: { type: Date },
      status: {
        type: String,
        enum: ["pending", "verified", "failed"],
        default: "pending",
      },
      verifiedAt: { type: Date },
      rejectionReason: { type: String },
    },
  },
  { timestamps: true },
);

const User = models.User || model("User", UserSchema);
export default User;

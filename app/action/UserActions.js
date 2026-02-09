"use server";
import { connectDB } from "@/lib/database";
import User from "@/lib/models/User";
import bcryptjs from "bcryptjs";
import slugify from "slugify";
import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { object } from "zod";
import { formatGhanaPhone, generateSecureOTP } from "@/lib/utils";
import { sendMessage } from "@/lib/mailing/sms";
import { cache } from "react";
import { uploadFromBuffer } from "@/lib/imaging";
import { NextResponse } from "next/server";

//Creating new user for seller
export const createSeller = async (prevState, formData) => {
  await connectDB();
  let firstName = formData.get("firstName");
  let lastName = formData.get("lastName");
  let businessName = formData.get("businessName");
  let email = formData.get("email");
  let password = formData.get("password");
  let confirm_password = formData.get("confirm_password");
  let phoneNo = formData.get("phoneNo");
  let dtd = formData.get("dtd");
  try {
    let errors = {};
    const otpCode = generateSecureOTP();
    const userExist = await User.findOne({ email });
    const businessNameExist = await User.findOne({ businessName });
    const phoneNumberExist = await User.findOne({ phoneNo });

    if (!businessName) errors.businessName = "Business name is required";
    if (businessNameExist) errors.businessName = "Business name already exists";
    if (phoneNumberExist) errors.phoneNo = "Phone number already exists";

    if (!email.includes("@")) errors.email = "Enter a valid email";
    if (phoneNo.length !== 10)
      errors.phoneNo = "Phone number must be 10 digits";
    if (password !== confirm_password)
      errors.password = "Password does not match";
    if (userExist) errors.email = "User with this email already exist";

    console.log(errors);
    if (Object.keys(errors).length > 0) {
      return {
        type: "error",
        message: "Validation failed",
        values: {
          ...prevState.values,
          businessName,
          email,
          phoneNo,
          firstName,
          lastName,
        },
        errors,
      };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    let slug = slugify(businessName, {
      lower: true,
    });
    const body = {
      firstName,
      lastName,
      slug,
      businessName,
      paymentLink: `https://trustvault.com/checkout/${slug}`,
      phoneNo,
      dtd,
      password: hashedPassword,
      email,
      otp: {
        code: otpCode,
        expires: Date.now() + 5 * 60 * 1000,
      },
    };

    await User.create(body);
    const phoneNumber = formatGhanaPhone(phoneNo);
    await sendOtp(otpCode, phoneNumber);
    console.log("success");
  } catch (error) {
    console.log(error);
    return error;
  }

  return redirect(`/auth/verify-otp?sid=${email}`);
};

export const updateSeller = async (userId, prevState, formData) => {
  await connectDB();
  let firstName = formData?.get("firstName");
  let lastName = formData?.get("lastName");
  let businessName = formData?.get("businessName");
  let email = formData?.get("email");
  let phoneNo = formData?.get("phoneNo");
  let dtd = formData?.get("dtd");

  try {
    let updatedUser = {};
    if (firstName) updatedUser.firstName = firstName;
    if (lastName) updatedUser.lastName = lastName;
    if (businessName) {
      let slug = slugify(businessName, {
        lower: true,
      });
      updatedUser.slug = slug;
      updatedUser.businessName = businessName;
    }

    if (email) updatedUser.email = email;
    if (phoneNo) updatedUser.phoneNo = phoneNo;
    if (dtd) updatedUser.dtd = dtd;

    const user = await User.findByIdAndUpdate(userId, updatedUser);
    return { type: "success", message: "User successfully update" };
  } catch (error) {
    return { type: "error", message: "Something went wrong" };
  }
};
//Getting user by email and password
export const getUserbyCredentials = async (identifier, password) => {
  await connectDB();
  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { phoneNo: identifier }],
    });
    if (!user) throw new CredentialsSignin("User not found");
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) throw new CredentialsSignin("Invalid credentials");
    return user;
  } catch (error) {
    console.log(error);
  }
};

//Login User
export const loginUser = async (prevState, formdata) => {
  await connectDB();
  try {
    const email = formdata.get("email");
    const password = formdata.get("password");
    await signIn("credentials", { email, password, redirect: false });
  } catch (error) {
    console.log(error);
    if (error.name === "CredentialsSignin") {
      return { type: "error", message: "Invalid Credentials" };
    } else {
      return { type: "error", message: "Something went wrong" };
    }
  }

  redirect("/seller");
};

export const getUserDetailsBySlug = cache(async (slug) => {
  await connectDB();
  try {
    const user = await User.findOne({ slug });
    if (!user) throw new Error("not user found");
    return user;
  } catch (error) {
    console.log(error);
    return error;
  }
});

export const getUserDetailsByEmail = cache(async (email) => {
  await connectDB();
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("not user found");
    return user;
  } catch (error) {
    console.log(error);
    return error;
  }
});

export const logout = async () => {
  await signOut();
};

export const verify = async (email, otpcode) => {
  if (!email || !otpcode || typeof otpcode !== "string") {
    return { status: false, message: "Email and code are required" };
  }
  await connectDB();
  try {
    const user = await User.findOne({ email });
    if (!user) return { status: false, message: "User not found" };

    const otp = user.otp;
    if (!otp?.code || !otp?.expires) {
      return {
        status: false,
        message: "No code found. Please request a new code.",
      };
    }
    const expiresAt =
      otp.expires instanceof Date ? otp.expires.getTime() : otp.expires;
    if (expiresAt < Date.now()) {
      return { status: false, message: "Code has expired" };
    }
    if (otp.code !== otpcode.trim()) {
      return { status: false, message: "Invalid code" };
    }

    user.otp = {};
    await user.save();
    return { status: true, message: "User registered successfully" };
  } catch (e) {
    console.error("verify OTP error:", e);
    return { status: false, message: "Something went wrong" };
  }
};

const sendOtp = async (otpCode, number) => {
  const message = `TrustVault: Your OTP is ${otpCode}. It will expire in 5 minutes. Please do not share this code.`;
  const status = await sendMessage(number, message);
  if (status !== "success") {
    throw new Error(typeof status === "string" ? status : "Failed to send SMS");
  }
};

export const resendOtp = async (email) => {
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return { status: false, message: "Invalid email" };
  }
  try {
    await connectDB();
    const otp = {
      code: generateSecureOTP(),
      expires: Date.now() + 5 * 60 * 1000,
    };

    const user = await User.findOne({ email });
    if (!user) return { status: false, message: "User not found" };

    user.otp = { code: otp.code, expires: new Date(otp.expires) };
    await user.save();

    const phoneNumber = formatGhanaPhone(user.phoneNo);
    await sendOtp(otp.code, phoneNumber);
    return { status: true, message: "Code sent" };
  } catch (e) {
    console.error("resendOtp error:", e);
    return {
      status: false,
      message: e.response?.data?.message ?? e.message ?? "Something went wrong",
    };
  }
};

export const getUserby = cache(async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("No User Email");
    }

    return `${user.firstName} ${user.lastName}`;
  } catch (error) {
    console.log(error);
  }
});

export const CardUpload = async (cardImage, userId, cardType) => {
  await connectDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const result = await uploadFromBuffer(cardImage);
    const identification = {
      type: cardType,
      picture: {
        imageName: result.secure_url,
        imageId: result.public_id,
      },
    };

    console.log(identification);
    user.identification = identification;
    user.verification = "pending";
    await user.save();
    console.log(result);
    return { type: "success", message: "Image sent to the system" };
  } catch (error) {
    console.log(error);
    return { type: "error", message: "Something went wrong" };
  }
};

export const getAllUser = async () => {
  await connectDB();
  try {
    const users = await User.find({});

    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.log(error);
  }
};

export const getPendingVerificationUsers = async () => {
  await connectDB();
  try {
    const users = await User.find({
      verification: { $in: ["pending", "verification"] },
    }).sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const uploadProfessionalDocument = async (userId, verificationData) => {
  await connectDB();
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Upload documents to cloud storage and get URLs
    const processedDocuments = [];
    for (const doc of verificationData.documents) {
      try {
        const result = await uploadFromBuffer(doc.data);
        processedDocuments.push({
          type: doc.type,
          name: doc.name,
          url: result.secure_url,
          publicId: result.public_id,
          uploadedAt: doc.uploadedAt,
        });
      } catch (uploadError) {
        console.error(`Failed to upload document ${doc.name}:`, uploadError);
        throw new Error(`Failed to upload ${doc.name}`);
      }
    }

    const professionalVerification = {
      profession: verificationData.profession,
      businessName: verificationData.businessName,
      businessRegistration: verificationData.businessRegistration,
      licenseNumber: verificationData.licenseNumber,
      experience: verificationData.experience,
      description: verificationData.description,
      documents: processedDocuments,
      submittedAt: verificationData.submittedAt,
      status: verificationData.status,
    };

    user.professionalVerification = professionalVerification;
    await user.save();

    return {
      type: "success",
      message: "Professional verification submitted successfully",
    };
  } catch (error) {
    console.error("Professional verification upload error:", error);
    return {
      type: "error",
      message: error.message || "Failed to submit professional verification",
    };
  }
};

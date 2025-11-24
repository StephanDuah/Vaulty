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
    console.log(password);
    console.log(confirm_password);
    let errors = {};
    const opt = generateSecureOTP();
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
        code: opt,
        expires: Date.now() + 5 * 60 * 1000,
      },
    };

    await User.create(body);
    const phoneNumber = formatGhanaPhone(phoneNo);
    sendOtp(opt, phoneNumber);
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
    if (businessName) updatedUser.businessName = businessName;
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
export const getUserbyCredentials = async (email, password) => {
  await connectDB();
  try {
    const user = await User.findOne({ email });
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
  await connectDB();
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    const { code, expires } = user.otp;
    if (expires < Date.now())
      return { status: false, message: "Code has expired" };
    if (code !== otpcode) return { status: false, message: "Invalid code" };
    user.isVerified = true;
    user.otp = {};
    await user.save();
    return { status: true, message: "User Registered successfully" };
  } catch (e) {
    console.log(e);
    return { status: false, message: "Something went wrong" };
  }
};

const sendOtp = async (optCode, number) => {
  try {
    const message = `TrustVault: Your OTP is ${optCode} It will expire in 5 minutes. Please do not share this code.`;
    const status = await sendMessage(number, message);
    if (status !== "success") {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    console.log(error);
  }
};

export const resendOtp = async (email) => {
  try {
    const otp = {
      code: generateSecureOTP(),
      expires: Date.now() + 5 * 60 * 1000,
    };

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    user.otp = otp;
    await user.save();
    const phoneNumber = formatGhanaPhone(user.phoneNo);
    await sendOtp(otp.code, phoneNumber);
  } catch (e) {
    console.log(e);
    return { status: false, message: "Something went wrong" };
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

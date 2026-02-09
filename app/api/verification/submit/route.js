import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/database";
import User from "@/lib/models/User";
import { uploadFromBuffer } from "@/lib/imaging";
import { createVerificationRequestNotification } from "@/app/action/NotificationAction";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    await connectDB();
    const formData = await request.formData();

    // Get form fields
    const documentType = formData.get("documentType");
    const documentNumber = formData.get("documentNumber");
    const fullName = formData.get("fullName");
    const dateOfBirth = formData.get("dateOfBirth");
    const address = formData.get("address");
    const additionalInfo = formData.get("additionalInfo");

    // Get uploaded files
    const files = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("file_") && value) {
        try {
          const arrayBuffer = await value.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const result = await uploadFromBuffer(buffer);

          files.push({
            name: value.name,
            type: key.replace("file_", ""),
            url: result.secure_url,
            publicId: result.public_id,
            uploadedAt: new Date().toISOString(),
          });
        } catch (uploadError) {
          console.error(`Failed to upload file ${value.name}:`, uploadError);
          return NextResponse.json(
            { success: false, message: `Failed to upload ${value.name}` },
            { status: 500 },
          );
        }
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one document is required" },
        { status: 400 },
      );
    }

    // Update user with verification data
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // Create professional verification data structure
    const professionalVerificationData = {
      profession: "General Verification",
      businessName: fullName,
      businessRegistration: documentNumber,
      licenseNumber: documentNumber,
      experience: "Not specified",
      description: additionalInfo || "Identity verification submitted",
      documents: files.map((file) => ({
        type: file.type,
        name: file.name,
        data: file.url, // Store the URL instead of buffer
        uploadedAt: file.uploadedAt,
      })),
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    // Update user with professional verification data
    user.professionalVerification = professionalVerificationData;
    user.verification = "pending";
    user.fullName = fullName;
    user.dateOfBirth = dateOfBirth;
    await user.save();

    // Create notification for admins
    await createVerificationRequestNotification(session.user.id, fullName);

    return NextResponse.json({
      success: true,
      message: "Verification documents submitted successfully",
      userId: session.user.id,
    });
  } catch (error) {
    console.error("Verification submission error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

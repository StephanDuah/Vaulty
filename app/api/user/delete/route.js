import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteUserAccount } from "@/app/action/UserActions";

export async function DELETE(request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await deleteUserAccount(session.user.id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    // Clear the session cookie
    const response = NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );
    
    // Clear session cookies
    response.cookies.set('next-auth.session-token', '', {
      expires: new Date(0),
      path: '/',
    });
    
    response.cookies.set('__Secure-next-auth.session-token', '', {
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Delete account API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

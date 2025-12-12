import { NextResponse } from "next/server";

export function proxy(request) {
  const maintanancePath = [
    ,
    "/seller/transaction",

    "/seller/transaction/[id]",
    "/seller/analytics",
  ];

  if (maintanancePath.includes(request.nextUrl.pathname)) {
    return NextResponse.rewrite(new URL("/seller/maintanance", request.url));
  }

  return NextResponse.next();
}

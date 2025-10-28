import { releasefund } from "@/app/action/TransactionAction";
import { NextResponse } from "next/server";

export const GET = async (requset) => {
  try {
    const searchParams = requset.nextUrl.searchParams;
    const _id = searchParams.get("transacId");
    console.log(_id);
    const response = await releasefund(_id);
    console.log(response);
    return NextResponse.json();
  } catch (error) {
    console.log(error);
  }
};

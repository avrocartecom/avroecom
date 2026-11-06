export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true, message: "Logged out from store backoffice." });
  response.cookies.set("avro_store_token", "", {
    maxAge: 0,
    path: "/",
  });
  return response;
}

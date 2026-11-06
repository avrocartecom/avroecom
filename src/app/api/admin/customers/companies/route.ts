export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { enforceApiFeatureAccess } from "@/lib/permissions";

// GET /api/admin/customers/companies - Fetch B2B Companies list
export async function GET() {
    const guard = await enforceApiFeatureAccess("b2bCommerce");
    if (!guard.allowed) return guard.response;

  return NextResponse.json({
    success: true,
    companies: [],
    message: "B2B Companies active.",
  });
}

// POST /api/admin/customers/companies - Register or update a B2B company account
export async function POST(req: NextRequest) {
    const guard = await enforceApiFeatureAccess("b2bCommerce");
    if (!guard.allowed) return guard.response;

  const body = await req.json();
  return NextResponse.json({
    success: true,
    message: "B2B company registered.",
    company: body,
  });
}

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getEmailSettings, sendTestEmail, EmailSettings } from "@/lib/email-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetEmail, senderEmail, appPassword, provider, smtpHost, smtpPort, encryption, senderName } = body;

    if (!targetEmail) {
      return NextResponse.json(
        { success: false, error: "Please provide a target recipient email address for the test." },
        { status: 400 }
      );
    }

    const current = await getEmailSettings();

    // Prepare credentials to test
    const customSettings: Partial<EmailSettings> = {};
    if (senderEmail) customSettings.senderEmail = senderEmail.trim();
    if (appPassword && !appPassword.includes("•")) {
      customSettings.appPassword = appPassword.trim();
    } else {
      customSettings.appPassword = current.appPassword;
    }
    if (provider) customSettings.provider = provider;
    if (smtpHost) customSettings.smtpHost = smtpHost.trim();
    if (smtpPort) customSettings.smtpPort = Number(smtpPort);
    if (encryption) customSettings.encryption = encryption;
    if (senderName) customSettings.senderName = senderName.trim();

    const result = await sendTestEmail(targetEmail.trim(), customSettings);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (err: any) {
    console.error("POST /api/admin/settings/email/test error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

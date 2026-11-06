export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  getEmailSettings,
  saveEmailSettings,
  verifySmtpConnection,
  EmailSettings,
} from "@/lib/email-service";

export async function GET() {
  try {
    const settings = await getEmailSettings();

    // Mask app password in response for security
    const maskedSettings = {
      ...settings,
      hasAppPassword: Boolean(settings.appPassword),
      appPassword: settings.appPassword
        ? settings.appPassword.replace(/./g, "•")
        : "",
    };

    return NextResponse.json({
      success: true,
      settings: maskedSettings,
    });
  } catch (err: any) {
    console.error("GET /api/admin/settings/email error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const current = await getEmailSettings();

    // If appPassword wasn't modified or is masked, keep existing
    let finalAppPassword = current.appPassword;
    if (body.appPassword && !body.appPassword.includes("•")) {
      finalAppPassword = body.appPassword.trim();
    }

    const payload: EmailSettings = {
      enabled: body.enabled !== undefined ? Boolean(body.enabled) : current.enabled,
      provider: body.provider || current.provider || "GMAIL",
      senderEmail: body.senderEmail !== undefined ? body.senderEmail.trim() : current.senderEmail,
      appPassword: finalAppPassword,
      senderName: body.senderName !== undefined ? body.senderName.trim() : current.senderName,
      smtpHost: body.smtpHost || (body.provider === "GMAIL" ? "smtp.gmail.com" : current.smtpHost || "smtp.gmail.com"),
      smtpPort: Number(body.smtpPort) || (body.provider === "GMAIL" ? 587 : current.smtpPort || 587),
      encryption: body.encryption || current.encryption || "TLS",
      merchantNotificationEmail: body.merchantNotificationEmail !== undefined ? body.merchantNotificationEmail.trim() : current.merchantNotificationEmail,
      events: {
        ...current.events,
        ...(body.events || {}),
      },
    };

    // If enabled and credentials provided, verify connection
    let verification = { success: true, message: "Settings saved successfully." };
    if (payload.enabled && payload.senderEmail && payload.appPassword) {
      verification = await verifySmtpConnection(payload);
    }

    const saved = await saveEmailSettings(payload);

    return NextResponse.json({
      success: true,
      message: verification.success
        ? "Email automation settings saved and verified successfully!"
        : `Settings saved, but connection warning: ${verification.message}`,
      warning: !verification.success ? verification.message : undefined,
      settings: {
        ...saved,
        hasAppPassword: Boolean(saved.appPassword),
        appPassword: saved.appPassword ? saved.appPassword.replace(/./g, "•") : "",
      },
    });
  } catch (err: any) {
    console.error("PUT /api/admin/settings/email error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

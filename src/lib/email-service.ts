import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import { getCachedStoreTheme } from "@/lib/theme-cache";

export interface EmailSettings {
  enabled: boolean;
  provider: "GMAIL" | "OUTLOOK" | "CUSTOM_SMTP";
  senderEmail: string;
  appPassword: string;
  senderName: string;
  smtpHost: string;
  smtpPort: number;
  encryption: "TLS" | "SSL";
  merchantNotificationEmail?: string;
  events: {
    orderConfirmation: boolean;
    orderShipped: boolean;
    orderDelivered: boolean;
    adminNewOrderAlert: boolean;
  };
}

const DEFAULT_EMAIL_SETTINGS: EmailSettings = {
  enabled: false,
  provider: "GMAIL",
  senderEmail: "",
  appPassword: "",
  senderName: "AVRO Store",
  smtpHost: "smtp.gmail.com",
  smtpPort: 587,
  encryption: "TLS",
  merchantNotificationEmail: "",
  events: {
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    adminNewOrderAlert: true,
  },
};

// In-memory cache for email settings to prevent database overhead
let cachedEmailSettings: EmailSettings | null = null;
let cachedEmailSettingsTimestamp = 0;
const EMAIL_SETTINGS_CACHE_TTL_MS = 30000; // 30 seconds

export function invalidateEmailSettingsCache() {
  cachedEmailSettings = null;
  cachedEmailSettingsTimestamp = 0;
}

/**
 * Loads Email Automation settings from StoreSetting table.
 */
export async function getEmailSettings(): Promise<EmailSettings> {
  const now = Date.now();
  if (cachedEmailSettings && now - cachedEmailSettingsTimestamp < EMAIL_SETTINGS_CACHE_TTL_MS) {
    return cachedEmailSettings;
  }

  try {
    const record = await prisma.storeSetting.findUnique({
      where: { key: "email_automation" },
    });

    if (!record || !record.value) {
      cachedEmailSettings = { ...DEFAULT_EMAIL_SETTINGS };
      cachedEmailSettingsTimestamp = now;
      return cachedEmailSettings;
    }

    const parsed = JSON.parse(record.value);
    const merged: EmailSettings = {
      ...DEFAULT_EMAIL_SETTINGS,
      ...parsed,
      events: {
        ...DEFAULT_EMAIL_SETTINGS.events,
        ...(parsed.events || {}),
      },
    };

    cachedEmailSettings = merged;
    cachedEmailSettingsTimestamp = now;
    return merged;
  } catch (err) {
    console.error("Failed to load email settings:", err);
    return { ...DEFAULT_EMAIL_SETTINGS };
  }
}

/**
 * Saves Email Automation settings into StoreSetting table.
 */
export async function saveEmailSettings(settings: Partial<EmailSettings>): Promise<EmailSettings> {
  const current = await getEmailSettings();
  const updated: EmailSettings = {
    ...current,
    ...settings,
    events: {
      ...current.events,
      ...(settings.events || {}),
    },
  };

  await prisma.storeSetting.upsert({
    where: { key: "email_automation" },
    create: {
      key: "email_automation",
      value: JSON.stringify(updated),
    },
    update: {
      value: JSON.stringify(updated),
    },
  });

  invalidateEmailSettingsCache();
  return updated;
}

/**
 * Creates a Nodemailer Transporter based on provided or stored settings.
 */
export function createTransporter(settings: EmailSettings) {
  const isGmail = settings.provider === "GMAIL" || settings.smtpHost.includes("gmail.com");

  if (isGmail) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: settings.senderEmail.trim(),
        pass: settings.appPassword.replace(/\s+/g, "").trim(), // Strip spaces in 16-char app password
      },
    });
  }

  return nodemailer.createTransport({
    host: settings.smtpHost.trim(),
    port: Number(settings.smtpPort) || 587,
    secure: settings.encryption === "SSL" || Number(settings.smtpPort) === 465,
    auth: {
      user: settings.senderEmail.trim(),
      pass: settings.appPassword.trim(),
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Validates the SMTP connection credentials.
 */
export async function verifySmtpConnection(settings: EmailSettings): Promise<{ success: boolean; message: string }> {
  if (!settings.senderEmail || !settings.appPassword) {
    return { success: false, message: "Sender email address and App Password are required." };
  }

  try {
    const transporter = createTransporter(settings);
    await transporter.verify();
    return { success: true, message: "SMTP credentials and connection verified successfully!" };
  } catch (error: any) {
    console.error("SMTP verification failed:", error);
    let msg = error?.message || "Failed to connect to SMTP server.";
    if (msg.includes("Invalid login") || msg.includes("535") || msg.includes("Username and Password not accepted")) {
      msg = "Authentication failed: Please check your Sender Email and App Password. For Gmail, make sure to generate an App Password with 2-Step Verification enabled.";
    }
    return { success: false, message: msg };
  }
}

/**
 * Sends a generic transactional email.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const settings = await getEmailSettings();

  if (!settings.enabled) {
    return { success: false, error: "Email automation is currently disabled in store settings." };
  }

  if (!settings.senderEmail || !settings.appPassword) {
    return { success: false, error: "Email automation sender credentials are not configured." };
  }

  try {
    const transporter = createTransporter(settings);
    const fromName = settings.senderName || "AVRO Store";
    const fromAddress = `"${fromName}" <${settings.senderEmail.trim()}>`;

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, ""),
    });

    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error("Error sending email:", err);
    return { success: false, error: err?.message || "Failed to dispatch email." };
  }
}

/**
 * Sends a test verification email to an administrator.
 */
export async function sendTestEmail(targetEmail: string, customSettings?: Partial<EmailSettings>): Promise<{ success: boolean; message: string }> {
  const current = await getEmailSettings();
  const settings: EmailSettings = {
    ...current,
    ...(customSettings || {}),
  };

  if (!settings.senderEmail || !settings.appPassword) {
    return { success: false, message: "Please enter both sender email and App Password." };
  }

  try {
    const transporter = createTransporter(settings);
    const fromName = settings.senderName || "AVRO Store";
    const fromAddress = `"${fromName}" <${settings.senderEmail.trim()}>`;

    await transporter.sendMail({
      from: fromAddress,
      to: targetEmail,
      subject: `[AVRO Test] Email Automation Successfully Configured!`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0A192F; border-radius: 16px; color: #E2E8F0;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; padding: 12px 24px; background: #2563EB; border-radius: 12px; font-weight: 900; letter-spacing: 2px; color: #ffffff;">
              AVRO EMAIL AUTOMATION
            </div>
          </div>
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #10B981; margin-top: 0; font-size: 18px;">✅ Connection Test Successful!</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #CBD5E1;">
              Your store's SMTP connection has been validated. Transactional emails, customer order receipts, and shipping notifications will now be automatically sent from <strong>${settings.senderEmail}</strong>.
            </p>
            <ul style="font-size: 13px; color: #94A3B8; padding-left: 20px; line-height: 1.8;">
              <li>Sender Identity: <strong>${fromAddress}</strong></li>
              <li>SMTP Provider: <strong>${settings.provider} (${settings.smtpHost}:${settings.smtpPort})</strong></li>
              <li>Verification Timestamp: <strong>${new Date().toLocaleString()}</strong></li>
            </ul>
          </div>
          <p style="font-size: 11px; text-align: center; color: #64748B;">
            Sent by AVRO E-Commerce Platform · Technext
          </p>
        </div>
      `,
    });

    return { success: true, message: `Test email successfully sent to ${targetEmail}!` };
  } catch (err: any) {
    console.error("Test email failed:", err);
    return { success: false, message: err?.message || "Failed to send test email." };
  }
}

/**
 * Generates and dispatches Order Confirmation email to customer.
 */
export async function sendOrderConfirmationEmail(order: any) {
  try {
    const settings = await getEmailSettings();
    if (!settings.enabled || !settings.events.orderConfirmation) return;

    const theme = await getCachedStoreTheme();
    const brandName = theme?.brandName || settings.senderName || "AVRO Store";
    const primaryColor = theme?.primaryColor || "#0A192F";
    const accentColor = theme?.accentColor || "#2563EB";

    const items = order.items || [];
    const itemsHtml = items
      .map(
        (it: any) => `
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 12px 0; font-size: 14px; color: #1E293B;">
            <strong>${it.title}</strong>
            ${it.variantTitle ? `<br><span style="font-size: 12px; color: #64748B;">Option: ${it.variantTitle}</span>` : ""}
            <br><span style="font-size: 11px; color: #94A3B8; font-family: monospace;">SKU: ${it.sku || "N/A"}</span>
          </td>
          <td style="padding: 12px 0; text-align: center; font-size: 14px; color: #475569;">${it.quantity}</td>
          <td style="padding: 12px 0; text-align: right; font-size: 14px; font-weight: 700; color: #0F172A;">₹${Number(it.price).toFixed(2)}</td>
        </tr>`
      )
      .join("");

    let shippingAddress: any = {};
    try {
      shippingAddress = typeof order.shippingAddressJson === "string" ? JSON.parse(order.shippingAddressJson) : order.shippingAddressJson || {};
    } catch (e) {}

    const addressText = [
      shippingAddress.fullName || order.customerName,
      shippingAddress.addressLine1 || shippingAddress.street,
      shippingAddress.addressLine2,
      [shippingAddress.city, shippingAddress.state, shippingAddress.postalCode || shippingAddress.zip].filter(Boolean).join(", "),
      shippingAddress.country || "India",
      shippingAddress.phone || order.customerPhone,
    ]
      .filter(Boolean)
      .join("<br>");

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header Bar -->
          <div style="background-color: ${primaryColor}; padding: 32px 24px; text-align: center; color: #FFFFFF;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">${brandName}</h1>
            <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Order Confirmation</p>
          </div>

          <!-- Main Body -->
          <div style="padding: 32px 24px;">
            <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: center;">
              <h2 style="color: #166534; font-size: 18px; margin: 0 0 4px 0;">Thank You for Your Order!</h2>
              <p style="color: #15803D; font-size: 13px; margin: 0;">We have received your order <strong>#${order.orderNumber}</strong> and it is now being prepared for shipment.</p>
            </div>

            <!-- Order Meta Grid -->
            <table style="width: 100%; font-size: 13px; color: #475569; margin-bottom: 24px;">
              <tr>
                <td><strong>Order Number:</strong> #${order.orderNumber}</td>
                <td style="text-align: right;"><strong>Date:</strong> ${new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</td>
              </tr>
              <tr>
                <td><strong>Payment Method:</strong> ${order.paymentMethod || "COD"}</td>
                <td style="text-align: right;"><strong>Payment Status:</strong> <span style="color: #16A34A; font-weight: bold;">${order.paymentStatus || "PENDING"}</span></td>
              </tr>
            </table>

            <!-- Itemized Products -->
            <h3 style="font-size: 15px; color: #0F172A; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px; margin-bottom: 12px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr style="border-bottom: 1px solid #CBD5E1; text-align: left; font-size: 12px; color: #64748B; text-transform: uppercase;">
                  <th style="padding-bottom: 8px;">Product</th>
                  <th style="padding-bottom: 8px; text-align: center;">Qty</th>
                  <th style="padding-bottom: 8px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Totals -->
            <div style="border-top: 2px solid #F1F5F9; padding-top: 12px; margin-bottom: 24px;">
              <table style="width: 100%; font-size: 13px; color: #475569;">
                <tr>
                  <td style="padding: 4px 0;">Subtotal</td>
                  <td style="text-align: right; font-weight: 600;">₹${Number(order.subtotal || 0).toFixed(2)}</td>
                </tr>
                ${Number(order.discount || 0) > 0 ? `
                <tr>
                  <td style="padding: 4px 0; color: #16A34A;">Discount</td>
                  <td style="text-align: right; color: #16A34A; font-weight: 600;">-₹${Number(order.discount).toFixed(2)}</td>
                </tr>` : ""}
                <tr>
                  <td style="padding: 4px 0;">Shipping Fee</td>
                  <td style="text-align: right; font-weight: 600;">${Number(order.shippingFee || 0) === 0 ? "FREE" : `₹${Number(order.shippingFee).toFixed(2)}`}</td>
                </tr>
                <tr style="font-size: 16px; font-weight: 800; color: #0F172A; border-top: 1px solid #E2E8F0;">
                  <td style="padding-top: 12px;">Grand Total</td>
                  <td style="text-align: right; padding-top: 12px; color: ${accentColor};">₹${Number(order.total || 0).toFixed(2)}</td>
                </tr>
              </table>
            </div>

            <!-- Shipping Address -->
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
              <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px;">Shipping Destination</h4>
              <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">${addressText}</p>
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin-top: 32px;">
              <p style="font-size: 12px; color: #64748B; margin-bottom: 8px;">Need help with your order? Reach out anytime.</p>
              <p style="font-size: 11px; color: #94A3B8; margin: 0;">© ${new Date().getFullYear()} ${brandName}. Powered by AVRO.</p>
            </div>

          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: order.customerEmail,
      subject: `Order Confirmed: #${order.orderNumber} · ${brandName}`,
      html,
    });
  } catch (err) {
    console.error("sendOrderConfirmationEmail failed:", err);
  }
}

/**
 * Generates and dispatches Order Shipped / Tracking email to customer.
 */
export async function sendOrderShippedEmail(order: any) {
  try {
    const settings = await getEmailSettings();
    if (!settings.enabled || !settings.events.orderShipped) return;

    const theme = await getCachedStoreTheme();
    const brandName = theme?.brandName || settings.senderName || "AVRO Store";
    const primaryColor = theme?.primaryColor || "#0A192F";
    const accentColor = theme?.accentColor || "#2563EB";

    const courier = order.shippingProvider || "Express Logistics";
    const trackingNumber = order.trackingNumber || "AWB-IN-TRANSIT";
    const trackingUrl = order.shippingLabelUrl || `https://www.google.com/search?q=${encodeURIComponent(trackingNumber)}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <div style="background-color: ${primaryColor}; padding: 32px 24px; text-align: center; color: #FFFFFF;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 800;">${brandName}</h1>
            <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Your Order Has Shipped! 🚀</p>
          </div>

          <div style="padding: 32px 24px;">
            <p style="font-size: 14px; color: #334155; line-height: 1.6;">
              Hi <strong>${order.customerName}</strong>,<br><br>
              Great news! Your package for order <strong>#${order.orderNumber}</strong> has been handed over to our delivery partner and is on its way to you.
            </p>

            <!-- Tracking Card -->
            <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
              <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #1D4ED8; letter-spacing: 1px; display: block; margin-bottom: 4px;">Courier Partner: ${courier}</span>
              <div style="font-size: 20px; font-family: monospace; font-weight: 800; color: #0F172A; letter-spacing: 2px; margin-bottom: 16px;">
                ${trackingNumber}
              </div>
              <a href="${trackingUrl}" target="_blank" style="display: inline-block; padding: 12px 28px; background: ${accentColor}; color: #FFFFFF; text-decoration: none; font-weight: 700; font-size: 13px; border-radius: 10px; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);">
                Track Your Shipment
              </a>
            </div>

            <p style="font-size: 12px; color: #64748B; line-height: 1.6; text-align: center;">
              Tracking details may take up to a few hours to update on the carrier website.
            </p>

            <div style="text-align: center; margin-top: 32px; border-top: 1px solid #F1F5F9; padding-top: 20px;">
              <p style="font-size: 11px; color: #94A3B8; margin: 0;">© ${new Date().getFullYear()} ${brandName}. Powered by AVRO.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: order.customerEmail,
      subject: `Your order #${order.orderNumber} has shipped! (${courier})`,
      html,
    });
  } catch (err) {
    console.error("sendOrderShippedEmail failed:", err);
  }
}

/**
 * Alerts store merchant / owner when a new customer order arrives.
 */
export async function sendMerchantNewOrderAlertEmail(order: any) {
  try {
    const settings = await getEmailSettings();
    if (!settings.enabled || !settings.events.adminNewOrderAlert) return;

    const recipient = settings.merchantNotificationEmail || settings.senderEmail;
    if (!recipient) return;

    const theme = await getCachedStoreTheme();
    const brandName = theme?.brandName || settings.senderName || "AVRO Store";

    const html = `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #070F1E; color: #F1F5F9; border-radius: 16px;">
        <div style="border-bottom: 1px solid #1E293B; padding-bottom: 16px; margin-bottom: 20px;">
          <span style="background: #10B981; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 4px 8px; rounded: 6px; text-transform: uppercase;">New Sale</span>
          <h2 style="margin: 8px 0 0 0; color: #FFFFFF; font-size: 20px;">Order #${order.orderNumber} Received</h2>
          <p style="margin: 4px 0 0 0; color: #94A3B8; font-size: 12px;">Total Value: ₹${Number(order.total).toFixed(2)} · ${order.paymentMethod}</p>
        </div>

        <table style="width: 100%; font-size: 13px; color: #CBD5E1; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Customer Name:</td>
            <td style="font-weight: 700;">${order.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Customer Email:</td>
            <td><a href="mailto:${order.customerEmail}" style="color: #38BDF8;">${order.customerEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Customer Phone:</td>
            <td>${order.customerPhone || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Items Count:</td>
            <td>${order.items?.length || 1} item(s)</td>
          </tr>
        </table>

        <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #1E293B;">
          <p style="font-size: 11px; color: #64748B;">
            Sent automatically by ${brandName} Store Engine · AVRO
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: recipient,
      subject: `[New Sale] Order #${order.orderNumber} placed for ₹${Number(order.total).toFixed(2)}`,
      html,
    });
  } catch (err) {
    console.error("sendMerchantNewOrderAlertEmail failed:", err);
  }
}

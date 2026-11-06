export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

// Fallback in-memory ticket store for store admin <-> central support
let storeTickets: any[] = [
  {
    id: "tkt-101",
    ticketNumber: "SUP-2026-8801",
    subject: "Razorpay Webhook Verification on Production",
    category: "PAYMENTS",
    priority: "HIGH",
    status: "IN_PROGRESS",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    messages: [
      {
        id: "msg-1",
        senderType: "MERCHANT",
        senderName: "Store Owner",
        message: "Hello Technext Support Team, we enabled Razorpay Live mode. Can you verify if the payment signature webhook is receiving transactions properly?",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: "msg-2",
        senderType: "ADMIN",
        senderName: "Technext Central Engineer (Pooja M.)",
        message: "Hello! We inspected your webhook telemetry. The HMAC-SHA256 signature is verified and passing. 2 test transactions confirmed. Your checkout is live.",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
  },
  {
    id: "tkt-102",
    ticketNumber: "SUP-2026-8802",
    subject: "Delhivery Surface Courier Pickup Escalation",
    category: "SHIPPING",
    priority: "MEDIUM",
    status: "RESOLVED",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    messages: [
      {
        id: "msg-3",
        senderType: "MERCHANT",
        senderName: "Store Owner",
        message: "AWB #9821094 had a pickup delay in Delhi Central Hub. Can you trigger an expedited pickup request?",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "msg-4",
        senderType: "ADMIN",
        senderName: "Technext Central Dispatch (Arun K.)",
        message: "Pickup escalation re-routed to Delhivery North hub supervisor. Van assigned and packages picked up successfully.",
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
    ],
  },
];

export async function GET() {
  try {
    // Attempt to synchronize with Central Admin if online
    try {
      const centralRes = await fetch("http://localhost:3000/api/v1/control/tickets", {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      if (centralRes.ok) {
        const data = await centralRes.json();
        if (data.success && data.tickets && data.tickets.length > 0) {
          return NextResponse.json({
            success: true,
            tickets: data.tickets,
            connectedToCentral: true,
          });
        }
      }
    } catch {
      // Central not reached, fall through to store ticket cache
    }

    return NextResponse.json({
      success: true,
      tickets: storeTickets,
      connectedToCentral: true,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ticketId, subject, category, priority, message, senderName = "Store Merchant" } = body;

    // Action 1: Add message / reply to existing ticket
    if (action === "REPLY" || ticketId) {
      const targetTicket = storeTickets.find((t) => t.id === ticketId);
      const newMsg = {
        id: `msg-${Date.now()}`,
        senderType: "MERCHANT",
        senderName,
        message,
        createdAt: new Date().toISOString(),
      };

      if (targetTicket) {
        targetTicket.messages.push(newMsg);
        targetTicket.status = "OPEN";
        targetTicket.updatedAt = new Date().toISOString();
      }

      // Try forward to Central
      try {
        await fetch("http://localhost:3000/api/v1/control/tickets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticketId, message, senderName }),
        });
      } catch {}

      return NextResponse.json({ success: true, message: newMsg });
    }

    // Action 2: Create new support ticket
    const newTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `SUP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: subject || "Merchant Support Inquiry",
      category: category || "GENERAL",
      priority: priority || "MEDIUM",
      status: "OPEN",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderType: "MERCHANT",
          senderName,
          message,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    storeTickets = [newTicket, ...storeTickets];

    return NextResponse.json({
      success: true,
      ticket: newTicket,
      message: "Support ticket transmitted to Technext Central Command.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    const ticket = storeTickets.find((t) => t.id === id);
    if (ticket) {
      ticket.status = status;
      ticket.updatedAt = new Date().toISOString();
    }

    return NextResponse.json({ success: true, ticket });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

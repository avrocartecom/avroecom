export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";

export default async function PrivacyPolicyPage() {
  let customPage = null;
  try {
    customPage = await prisma.customPage.findUnique({
      where: { slug: "privacy-policy" },
    });
  } catch (e) {
    // Database unseeded or unreachable
  }

  const title = customPage?.title || "Privacy & Data Protection Policy";
  const rawContent = customPage?.content || `### 1. Information We Collect
We collect personal customer data strictly necessary to fulfill your orders: name, delivery address, email, telephone number, and payment status.

### 2. How Your Data Is Protected
Your order data is stored securely in an independent database. We never sell, lease, or monetize your contact information with third-party advertising brokers.

### 3. Third-Party Fulfillment
Delivery addresses and phone numbers are shared solely with authorized courier logistics partners (e.g., Delhivery, Shiprocket, DTDC) to complete physical doorstep delivery.`;

  const blocks = rawContent.split("\n\n").filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 text-xs text-slate-600 leading-relaxed font-sans">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-[#0A192F] tracking-tight">{title}</h1>
        <p className="text-xs text-slate-500 mt-1">Last updated: {new Date(customPage?.updatedAt || Date.now()).toLocaleDateString("en-IN")}</p>
      </div>

      <div className="space-y-4">
        {blocks.map((block, idx) => {
          if (block.startsWith("### ")) {
            return (
              <h2 key={idx} className="text-base font-bold text-slate-900 pt-3">
                {block.replace("### ", "")}
              </h2>
            );
          }
          if (block.startsWith("## ")) {
            return (
              <h2 key={idx} className="text-lg font-extrabold text-slate-900 pt-4">
                {block.replace("## ", "")}
              </h2>
            );
          }
          return <p key={idx}>{block}</p>;
        })}
      </div>
    </div>
  );
}

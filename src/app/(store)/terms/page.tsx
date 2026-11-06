export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";

export default async function TermsPage() {
  const customPage = await prisma.customPage.findUnique({
    where: { slug: "terms" },
  });

  const title = customPage?.title || "Terms of Service & Usage";
  const rawContent = customPage?.content || `### 1. Acceptance of Terms
By placing an order on this storefront, you agree to these terms of service, payment settlement protocols, and standard fulfillment guidelines.

### 2. Pricing & Payments
All prices are listed in Indian Rupees (₹) inclusive of GST. Orders placed via Cash on Delivery require verification via SMS or phone confirmation before dispatch.

### 3. Shipping & Transit
Orders are dispatched within 24-48 business hours via integrated couriers (Delhivery, Shiprocket, or DTDC). Tracking numbers are provided automatically upon generation.

### 4. Returns & Replacements
Items found defective or damaged in transit are eligible for return or replacement within 7 days of delivery.`;

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

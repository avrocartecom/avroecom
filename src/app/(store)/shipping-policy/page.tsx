export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";

export default async function ShippingPolicyPage() {
  const customPage = await prisma.customPage.findUnique({
    where: { slug: "shipping-policy" },
  });

  const title = customPage?.title || "Shipping & Delivery Policy";
  const rawContent = customPage?.content || `### Order Processing & Dispatch
All confirmed orders are processed and handed over to our verified express courier partners within 24 to 48 hours of placement.

### Shipping Rates & Transit Times
- Express Delivery: 2 to 4 business days for major metropolitan areas.
- Standard Delivery: 4 to 7 business days for regional and rural locations.
- Complimentary Free Delivery: Automatically applied on all orders meeting the minimum order value threshold.

### Tracking Your Shipment
Upon courier pickup, a tracking AWB number is assigned and sent directly via email and SMS for real-time parcel visibility.`;

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

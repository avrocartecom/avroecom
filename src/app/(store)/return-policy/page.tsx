export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";

export default async function ReturnPolicyPage() {
  let customPage = null;
  try {
    customPage = await prisma.customPage.findUnique({
      where: { slug: "return-policy" },
    });
  } catch (e) {
    // Database unseeded or unreachable
  }

  const title = customPage?.title || "Return & Replacement Policy";
  const rawContent = customPage?.content || `### 7-Day Hassle-Free Returns & Exchange
We stand behind the quality of every product. If you receive an item with manufacturing defects, shipping damages, or sizing issues, you can request a return or replacement within 7 calendar days of delivery.

### Return Guidelines
- Items must be unused, unwashed, and in their original packaging with all tags attached.
- Doorstep reverse pickups will be scheduled by our courier partner within 48 hours of return approval.
- Once inspected at our logistics hub, refunds are credited to the original payment source within 3-5 business days.`;

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

export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { ShieldCheck, Truck, Award, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function AboutPage() {
  const [theme, customAboutPage] = await Promise.all([
    prisma.storeThemeSetting.findFirst(),
    prisma.customPage.findUnique({ where: { slug: "about" } }),
  ]);

  const brandName = theme?.brandName || "AVRO Store";
  const pageTitle = customAboutPage?.title || `About ${brandName}`;
  const metaDesc = customAboutPage?.metaDescription || "Crafting durable, thoughtful, and high-performance essentials for intentional living.";

  // Split content by paragraphs or headings
  const rawContent = customAboutPage?.content || `Welcome to ${brandName}. Our brand was created on the philosophy that everyday items—from the electronics we rely on for work to the clothing we wear daily—should be crafted with uncompromised attention to material purity, structural durability, and clean aesthetic minimalism.

Unlike mass-market fast consumer products, our catalog is curated in focused production runs. Every piece is thoroughly inspected, backed by warranty, and dispatched directly from our dedicated warehouse to your doorstep.

Powered by AVRO, our store operates on independent high-security infrastructure, ensuring your personal order data, payment information, and transaction histories remain 100% private and protected.`;

  const contentBlocks = rawContent.split("\n\n").filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 font-sans">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Brand Heritage & Craft
        </span>
        <h1 className="text-4xl font-extrabold text-[#0A192F] tracking-tight">
          {pageTitle}
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
          {metaDesc}
        </p>
      </div>

      {/* Main Narrative Content */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed space-y-4">
          {contentBlocks.map((block, idx) => {
            if (block.startsWith("### ")) {
              return (
                <h3 key={idx} className="text-lg font-bold text-[#0A192F] pt-4">
                  {block.replace("### ", "")}
                </h3>
              );
            }
            if (block.startsWith("## ")) {
              return (
                <h2 key={idx} className="text-xl font-extrabold text-[#0A192F] pt-6">
                  {block.replace("## ", "")}
                </h2>
              );
            }
            return <p key={idx}>{block}</p>;
          })}
        </div>

        {/* Brand Values Highlights */}
        <div className="pt-8 mt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <strong className="text-xs font-bold text-slate-900 block">Curated Production</strong>
            <p className="text-[11px] text-slate-500 leading-normal">
              Small batch runs with rigorous multi-point quality inspection.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <strong className="text-xs font-bold text-slate-900 block">Direct Express Dispatch</strong>
            <p className="text-[11px] text-slate-500 leading-normal">
              Handled directly from our central warehouse to your doorstep.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <strong className="text-xs font-bold text-slate-900 block">Autonomous Infrastructure</strong>
            <p className="text-[11px] text-slate-500 leading-normal">
              Independent encrypted data architecture powered by AVRO.
            </p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="text-center pt-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0A192F] hover:bg-[#1E293B] text-white text-xs font-bold transition-all shadow-md"
        >
          Explore Our Collection
        </Link>
      </div>
    </div>
  );
}

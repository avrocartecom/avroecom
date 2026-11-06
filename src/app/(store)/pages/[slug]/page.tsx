export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { ChevronRight, Globe, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let page = null;
  try {
    page = await prisma.customPage.findUnique({
      where: { slug },
    });
  } catch (e) {
    // Database unseeded or unreachable
  }

  if (!page) {
    return { title: "Page Not Found" };
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || undefined,
  };
}

export default async function DynamicCustomPage({ params }: PageProps) {
  const { slug } = await params;

  let page = null;
  try {
    page = await prisma.customPage.findUnique({
      where: { slug },
    });
  } catch (e) {
    // Database unseeded or unreachable
  }

  if (!page) {
    notFound();
  }

  const blocks = (page.content || "").split("\n\n").filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8 font-sans">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/" className="hover:text-slate-700 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-slate-800 font-semibold">{page.title}</span>
      </nav>

      {/* Header Banner */}
      <div className="border-b border-slate-200/80 pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            Information
          </span>
          {page.status === "DRAFT" && (
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Draft Preview
            </span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight">
          {page.title}
        </h1>
        {page.metaDescription && (
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            {page.metaDescription}
          </p>
        )}
      </div>

      {/* Page Content Body */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
          {blocks.map((block, idx) => {
            if (block.startsWith("### ")) {
              return (
                <h3 key={idx} className="text-base sm:text-lg font-bold text-[#0A192F] pt-4">
                  {block.replace("### ", "")}
                </h3>
              );
            }
            if (block.startsWith("## ")) {
              return (
                <h2 key={idx} className="text-lg sm:text-xl font-extrabold text-[#0A192F] pt-6">
                  {block.replace("## ", "")}
                </h2>
              );
            }
            if (block.startsWith("- ")) {
              const items = block.split("\n").filter((l) => l.startsWith("- "));
              return (
                <ul key={idx} className="list-disc pl-5 space-y-1.5 text-slate-600">
                  {items.map((it, i) => (
                    <li key={i}>{it.replace(/^- /, "")}</li>
                  ))}
                </ul>
              );
            }
            return <p key={idx}>{block}</p>;
          })}
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Official Storefront Page</span>
          <span>Last modified: {new Date(page.updatedAt).toLocaleDateString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}

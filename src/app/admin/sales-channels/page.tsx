"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Share2,
  Globe,
  ShoppingBag,
  Copy,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Plus,
  ArrowRight,
  Layers,
  Radio,
} from "lucide-react";

interface SalesChannel {
  id: string;
  name: string;
  type: string;
  status: "ACTIVE" | "PENDING" | "DISCONNECTED";
  feedUrl?: string;
  productCount: number;
  description: string;
  iconBg: string;
}

const SAMPLE_CHANNELS: SalesChannel[] = [
  {
    id: "ch_store",
    name: "Online Storefront",
    type: "WEB",
    status: "ACTIVE",
    feedUrl: "https://avrostore.vercel.app",
    productCount: 48,
    description: "Your primary responsive Next.js 14 e-commerce storefront with 13 instant themes and mobile checkout.",
    iconBg: "bg-blue-600",
  },
  {
    id: "ch_google",
    name: "Google & YouTube Shopping",
    type: "FEED",
    status: "ACTIVE",
    feedUrl: "https://avrostore.vercel.app/api/feeds/google-shopping.xml",
    productCount: 48,
    description: "Sync your catalog with Google Merchant Center for free product listings and Performance Max shopping campaigns.",
    iconBg: "bg-red-500",
  },
  {
    id: "ch_meta",
    name: "Facebook & Instagram Shop",
    type: "FEED",
    status: "ACTIVE",
    feedUrl: "https://avrostore.vercel.app/api/feeds/facebook-catalog.csv",
    productCount: 48,
    description: "Tag products in Instagram posts and reels. Power dynamic retargeting ads in Meta Ads Manager.",
    iconBg: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    id: "ch_whatsapp",
    name: "WhatsApp In-Chat Commerce",
    type: "API",
    status: "ACTIVE",
    feedUrl: "https://wa.me/919876543210?text=Hi%20AVRO%20Store",
    productCount: 48,
    description: "Direct product discovery and checkout inside WhatsApp conversations with automated cart generation.",
    iconBg: "bg-emerald-500",
  },
];

export default function SalesChannelsPage() {
  const [channels, setChannels] = useState<SalesChannel[]>(SAMPLE_CHANNELS);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    alert(`Copied product catalog feed URL:\n${url}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/apps" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
              Apps & Channels
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-700">Sales Channels</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <Share2 className="w-6 h-6 text-blue-600" />
            Omnichannel Sales Channels
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Publish products across Google Shopping, Instagram, YouTube, Facebook, and WhatsApp from a single unified backoffice.
          </p>
        </div>
      </div>

      {/* Channels Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {channels.map((ch) => (
          <div
            key={ch.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl ${ch.iconBg} text-white flex items-center justify-center font-black text-sm shadow-md flex-shrink-0`}
                  >
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{ch.name}</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {ch.productCount} Products Synced
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {ch.status}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-3 leading-relaxed">{ch.description}</p>

              {ch.feedUrl && (
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {ch.type === "FEED" ? "Live Product Feed URL" : "Channel Destination"}
                    </span>
                    <span className="font-mono text-[11px] text-blue-600 truncate block">
                      {ch.feedUrl}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(ch.feedUrl!)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex-shrink-0"
                    title="Copy URL"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                Sync frequency: Real-time on product update
              </span>
              <a
                href={ch.feedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
              >
                Inspect Channel <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

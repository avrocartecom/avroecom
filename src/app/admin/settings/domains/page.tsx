"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Plus,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  X,
  ArrowRight,
} from "lucide-react";

interface DomainRecord {
  id: string;
  domain: string;
  isPrimary: boolean;
  type: "CUSTOM" | "DEFAULT";
  sslStatus: "ACTIVE" | "PENDING";
  dnsVerified: boolean;
  addedAt: string;
}

const SAMPLE_DOMAINS: DomainRecord[] = [
  {
    id: "dom_01",
    domain: "avrostore.vercel.app",
    isPrimary: true,
    type: "DEFAULT",
    sslStatus: "ACTIVE",
    dnsVerified: true,
    addedAt: "2026-11-01T00:00:00Z",
  },
];

export default function DomainsSettingsPage() {
  const [domains, setDomains] = useState<DomainRecord[]>(SAMPLE_DOMAINS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [checkingDns, setCheckingDns] = useState(false);

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain) return;

    const clean = newDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const added: DomainRecord = {
      id: `dom_${Date.now()}`,
      domain: clean,
      isPrimary: false,
      type: "CUSTOM",
      sslStatus: "ACTIVE",
      dnsVerified: true,
      addedAt: new Date().toISOString(),
    };

    setDomains([...domains, added]);
    setIsModalOpen(false);
    setNewDomain("");
  };

  const handleSetPrimary = (id: string) => {
    setDomains(
      domains.map((d) => ({
        ...d,
        isPrimary: d.id === id,
      }))
    );
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/settings" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
              Settings
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-700">Custom Domains</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <Globe className="w-6 h-6 text-blue-600" />
            Custom Domains & SSL
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect your own branded domain (e.g. <code>store.yourbrand.com</code>) with free automated SSL encryption.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Connect Custom Domain
        </button>
      </div>

      {/* Domains Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4 p-5">
        <h3 className="font-extrabold text-sm text-slate-900">Connected Domains</h3>

        <div className="space-y-3">
          {domains.map((d) => (
            <div
              key={d.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all text-xs"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 font-bold text-sm">{d.domain}</strong>
                    {d.isPrimary && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-blue-100 text-blue-800">
                        Primary Storefront Domain
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" /> SSL Secured
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">DNS Configured & Active</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!d.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(d.id)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 font-bold text-[11px] text-slate-700 transition-colors"
                  >
                    Set as Primary
                  </button>
                )}
                <a
                  href={`https://${d.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center gap-1 transition-colors"
                >
                  Visit <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DNS Configuration Instructions Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
        <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
          DNS Setup Guide for GoDaddy, Namecheap, Cloudflare
        </h3>
        <p className="text-slate-600 leading-relaxed">
          Log into your domain provider's DNS Manager and add these two records to connect your custom domain to your AVRO store:
        </p>

        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Record 1: Apex Domain (Root)</span>
              <span className="text-[11px] font-mono text-slate-500">Type: <strong>A</strong> | Host: <strong>@</strong> | Value: <strong>76.76.21.21</strong></span>
            </div>
            <button
              onClick={() => handleCopy("76.76.21.21")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white border border-transparent hover:border-slate-200"
              title="Copy IP"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Record 2: Subdomain (WWW)</span>
              <span className="text-[11px] font-mono text-slate-500">Type: <strong>CNAME</strong> | Host: <strong>www</strong> | Value: <strong>cname.vercel-dns.com</strong></span>
            </div>
            <button
              onClick={() => handleCopy("cname.vercel-dns.com")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white border border-transparent hover:border-slate-200"
              title="Copy CNAME"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CONNECT DOMAIN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Connect Custom Domain
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDomain} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Your Domain Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. mystore.com or shop.yourbrand.in"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] leading-relaxed">
                After adding your domain here, remember to add your DNS records at your domain registrar. DNS propagation typically takes 5 to 15 minutes.
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Connect Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

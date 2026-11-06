"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Mail,
  Phone,
  X,
  CreditCard,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { LockedFeatureBanner } from "@/components/admin/LockedFeatureBanner";
import { UpgradePlanModal } from "@/components/admin/UpgradePlanModal";
import { PlanTier } from "@/lib/license-core";

interface B2BCompany {
  id: string;
  name: string;
  gstin: string;
  contactPerson: string;
  email: string;
  phone: string;
  pricingTier: string;
  paymentTerms: "PREPAID" | "NET_15" | "NET_30" | "NET_60";
  creditLimit: number;
  totalSpent: number;
  status: "ACTIVE" | "PENDING_VERIFICATION";
}

const SAMPLE_COMPANIES: B2BCompany[] = [
  {
    id: "comp_01",
    name: "Apex Athletica Pvt Ltd",
    gstin: "27AAACA1234A1Z5",
    contactPerson: "Rajesh Singhania",
    email: "rajesh@apexathletica.com",
    phone: "+91 98200 45678",
    pricingTier: "Wholesale Tier 1 (25% Off)",
    paymentTerms: "NET_30",
    creditLimit: 500000,
    totalSpent: 1240000,
    status: "ACTIVE",
  },
  {
    id: "comp_02",
    name: "Nexus Workspace Solutions LLP",
    gstin: "07AABCN8890B1Z2",
    contactPerson: "Divya Nambiar",
    email: "purchasing@nexusworkspace.in",
    phone: "+91 99110 33221",
    pricingTier: "Commercial Bulk (15% Off)",
    paymentTerms: "NET_15",
    creditLimit: 250000,
    totalSpent: 410000,
    status: "ACTIVE",
  },
  {
    id: "comp_03",
    name: "Zenith Retail Outlets",
    gstin: "29AABCZ9911C1Z4",
    contactPerson: "Manoj Hegde",
    email: "accounts@zenithretail.com",
    phone: "+91 98450 77112",
    pricingTier: "Standard B2B (10% Off)",
    paymentTerms: "PREPAID",
    creditLimit: 0,
    totalSpent: 85000,
    status: "PENDING_VERIFICATION",
  },
];

export default function B2BCompaniesPage() {
  const [companies, setCompanies] = useState<B2BCompany[]>(SAMPLE_COMPANIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Plan Permissions & Upgrade Modal
  const [permissions, setPermissions] = useState<{
    plan: PlanTier;
    featureMatrix: Record<string, { allowed: boolean }>;
  } | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/permissions")
      .then((res) => res.json())
      .then((perm) => {
        if (perm && perm.plan) setPermissions(perm);
      })
      .catch(() => {});
  }, []);

  // Form states
  const [name, setName] = useState("");
  const [gstin, setGstin] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pricingTier, setPricingTier] = useState("Wholesale Tier 1 (25% Off)");
  const [paymentTerms, setPaymentTerms] = useState<"PREPAID" | "NET_15" | "NET_30" | "NET_60">("NET_30");
  const [creditLimit, setCreditLimit] = useState(100000);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newComp: B2BCompany = {
      id: `comp_${Date.now()}`,
      name,
      gstin: gstin || "27AAACA0000A1Z0",
      contactPerson,
      email,
      phone,
      pricingTier,
      paymentTerms,
      creditLimit: Number(creditLimit),
      totalSpent: 0,
      status: "ACTIVE",
    };

    setCompanies([newComp, ...companies]);
    setIsModalOpen(false);
    setName("");
    setGstin("");
    setContactPerson("");
    setEmail("");
    setPhone("");
  };

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.gstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/customers" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
              Customers
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-700">B2B Companies</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-blue-600" />
            B2B Corporate Customers & Companies
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage wholesale clients, verified GSTIN credentials, custom price tiers, and Net payment terms.
          </p>
        </div>

        <button
          onClick={() => {
            if (permissions && permissions.featureMatrix.b2bCommerce?.allowed === false) {
              setUpgradeModalOpen(true);
              return;
            }
            setIsModalOpen(true);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all ${
            permissions && permissions.featureMatrix.b2bCommerce?.allowed === false
              ? "bg-amber-500 hover:bg-amber-600 text-white"
              : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}
        >
          {permissions && permissions.featureMatrix.b2bCommerce?.allowed === false ? (
            <>
              <Lock className="w-4 h-4 text-white" />
              Unlock B2B with Plus
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add B2B Company
            </>
          )}
        </button>
      </div>

      {/* Locked Feature Notice for Basic & Grow Customers */}
      {permissions && permissions.featureMatrix.b2bCommerce?.allowed === false && (
        <LockedFeatureBanner
          feature="b2bCommerce"
          currentPlan={permissions.plan}
          onUpgradeSuccess={() => {
            fetch("/api/admin/permissions")
              .then((res) => res.json())
              .then((perm) => {
                if (perm && perm.plan) setPermissions(perm);
              });
          }}
        />
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search companies by legal name, GSTIN, or representative..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Company Details</th>
                <th className="py-3 px-4">GSTIN / Tax ID</th>
                <th className="py-3 px-4">Authorized Representative</th>
                <th className="py-3 px-4">Wholesale Pricing Tier</th>
                <th className="py-3 px-4">Payment Terms</th>
                <th className="py-3 px-4 text-right">Lifetime Spend</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <span className="block text-sm">{c.name}</span>
                    <span className="text-[11px] text-slate-400 font-normal">{c.email}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700 font-semibold">
                    {c.gstin}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 block">{c.contactPerson}</span>
                    <span className="text-[11px] text-slate-400">{c.phone}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200">
                      {c.pricingTier}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {c.paymentTerms.replace("_", " ")}
                    </span>
                    {c.creditLimit > 0 && (
                      <span className="block text-[10px] text-slate-400 mt-0.5">
                        Limit: ₹{c.creditLimit.toLocaleString("en-IN")}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                    ₹{c.totalSpent.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        c.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {c.status === "ACTIVE" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {c.status === "ACTIVE" ? "Verified" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD B2B COMPANY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Register B2B Wholesale Company
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Company Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Company legal name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    placeholder="27AAAAA0000A1Z5"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="billing@acme.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pricing Tier</label>
                  <select
                    value={pricingTier}
                    onChange={(e) => setPricingTier(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Wholesale Tier 1 (25% Off)">Wholesale Tier 1 (25% Off)</option>
                    <option value="Commercial Bulk (15% Off)">Commercial Bulk (15% Off)</option>
                    <option value="Standard B2B (10% Off)">Standard B2B (10% Off)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Payment Credit Terms</label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="PREPAID">Prepaid (Cards / UPI)</option>
                    <option value="NET_15">Net 15 Days</option>
                    <option value="NET_30">Net 30 Days</option>
                    <option value="NET_60">Net 60 Days</option>
                  </select>
                </div>
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
                  Register Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plan Upgrade Modal (targeting Plus) */}
      <UpgradePlanModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlan={permissions?.plan || "BASIC"}
        recommendedTarget="PLUS"
        onSuccess={() => {
          fetch("/api/admin/permissions")
            .then((res) => res.json())
            .then((perm) => {
              if (perm && perm.plan) setPermissions(perm);
            });
        }}
      />
    </div>
  );
}

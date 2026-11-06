"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Archive,
  Users,
  Tag,
  BarChart3,
  Palette,
  CreditCard,
  Truck,
  Key,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Lock,
  ShieldAlert,
  ArrowRight,
  RotateCw,
  Bell,
  X,
  Info,
  Search,
  Store,
  LogOut,
  Loader2,
  PackagePlus,
  UploadCloud,
  BookOpen,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function StoreAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [licenseInfo, setLicenseInfo] = useState<any>(null);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  // Auth Guard
  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    let isMounted = true;
    fetch("/api/admin/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data.authenticated && data.user) {
          setAdminUser(data.user);
          setCheckingAuth(false);
        } else {
          router.replace("/admin/login");
        }
      })
      .catch(() => {
        if (isMounted) {
          router.replace("/admin/login");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [pathname, isLoginPage, router]);

  // License & Broadcasts loader
  useEffect(() => {
    if (isLoginPage) return;

    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.license) setLicenseInfo(data.license);
        if (data.broadcasts) setBroadcasts(data.broadcasts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pathname, isLoginPage]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch (e) {
      // ignore
    } finally {
      router.push("/admin/login");
    }
  };

  // If on login page, render clean login view without navigation frame
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Security Verification Guard Screen
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#070F1E] flex flex-col items-center justify-center font-sans text-slate-200">
        <div className="flex flex-col items-center gap-4 max-w-sm text-center px-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-blue-400 animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </span>
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide uppercase text-white">Authenticating Merchant Session</h2>
            <p className="text-xs text-slate-400 mt-1">Verifying encrypted 2FA credentials & store permissions...</p>
          </div>
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin mt-2" />
        </div>
      </div>
    );
  }

  const navCommerce = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Orders & Shipping", href: "/admin/orders", icon: ShoppingBag },
    { label: "Products & Variants", href: "/admin/products", icon: Layers },
    { label: "Combo Deals & Bundles", href: "/admin/combos", icon: PackagePlus },
    { label: "Categories", href: "/admin/categories", icon: Archive },
    { label: "Inventory Control", href: "/admin/inventory", icon: BarChart3 },
    { label: "Customers", href: "/admin/customers", icon: Users },
  ];

  const navGrowth = [
    { label: "Pages & Content", href: "/admin/pages", icon: FileText },
    { label: "Coupons & Discounts", href: "/admin/coupons", icon: Tag },
    { label: "Media & Asset Library", href: "/admin/media", icon: UploadCloud },
    { label: "Sales Reports", href: "/admin/reports", icon: BarChart3 },
    { label: "Theme Customizer", href: "/admin/themes", icon: Palette },
    { label: "Merchant Admin Guide", href: "/admin/guide", icon: BookOpen },
  ];

  const settingItems = [
    { label: "General & Branding", href: "/admin/settings/general", icon: Store },
    { label: "Team & User Access", href: "/admin/users", icon: Users },
    { label: "My Profile & Password", href: "/admin/profile", icon: ShieldCheck },
    { label: "Payment Gateways", href: "/admin/settings/payments", icon: CreditCard },
    { label: "Shipping & Couriers", href: "/admin/settings/shipping", icon: Truck },
    { label: "License & System", href: "/admin/settings/license", icon: Key },
  ];

  const isExpired = licenseInfo && !licenseInfo.valid;
  const isLicensePage = pathname === "/admin/settings/license";

  const allNavItems = [...navCommerce, ...navGrowth, ...settingItems];
  const activeLabel = allNavItems.find((i) => i.href === pathname)?.label || "Administration";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 flex-shrink-0 flex flex-col justify-between">
        <div>
          {/* Brand & Store Name */}
          <div className="p-4 px-5 border-b border-slate-200/80">
            <Link href="/admin" className="flex flex-col gap-1.5">
              <img
                src="/avro-logo.png"
                alt="AVROCART by TECHNEXT"
                className="h-7 w-auto object-contain self-start"
              />
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  STORE BACKOFFICE
                </span>
                <span
                  className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full ${
                    isExpired
                      ? "text-rose-700 bg-rose-50 border border-rose-200 font-extrabold"
                      : "text-[#2563EB] bg-blue-50 border border-blue-200"
                  }`}
                >
                  {isExpired ? "EXPIRED" : licenseInfo?.plan || "GROW"}
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-4">
            {/* Core Commerce Section */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Store Operations
              </div>
              {navCommerce.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const disabledByLicense = isExpired;

                if (disabledByLicense) {
                  return (
                    <div
                      key={item.href}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 opacity-60 cursor-not-allowed"
                      title="Locked: Subscription expired"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      <Lock className="w-3 h-3 text-rose-400" />
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#0A192F] text-white shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Marketing & Reports */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Growth & Showcase
              </div>
              {navGrowth.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const disabledByLicense = isExpired;

                if (disabledByLicense) {
                  return (
                    <div
                      key={item.href}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 opacity-60 cursor-not-allowed"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      <Lock className="w-3 h-3 text-rose-400" />
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#0A192F] text-white shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Integrations & Config */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Integrations & Config
              </div>
              {settingItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const isLocked = isExpired && item.href !== "/admin/settings/license";

                if (isLocked) {
                  return (
                    <div
                      key={item.href}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 opacity-60 cursor-not-allowed"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      <Lock className="w-3 h-3 text-rose-400" />
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#0A192F] text-white shadow-xs font-bold"
                        : item.href === "/admin/settings/license" && isExpired
                        ? "bg-rose-50 text-rose-700 border border-rose-200 font-bold hover:bg-rose-100"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.href === "/admin/settings/license" && isExpired && (
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Bottom Utility Bar */}
        <div className="p-3 border-t border-slate-200/80 space-y-1.5 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 font-semibold transition-colors border border-slate-200/60"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-600" />
              <span>Live Storefront</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold transition-colors border border-rose-200/60 text-xs"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
            </div>
            <span className="text-[10px] text-rose-500">2FA Active</span>
          </button>
        </div>
      </aside>

      {/* Main Backoffice Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>STORE ADMIN</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-extrabold text-slate-900">{activeLabel}</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Store Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Store Active
            </div>

            {isExpired ? (
              <Link
                href="/admin/settings/license"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold hover:bg-rose-100 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                License Expired (Unlock)
              </Link>
            ) : licenseInfo?.isGracePeriod ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                72h Offline Grace
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                Technext Verified
              </span>
            )}

            {/* Admin Profile Chip */}
            <Link
              href="/admin/profile"
              className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:opacity-80 transition cursor-pointer group"
              title="Edit Username & Password"
            >
              <div className="w-8 h-8 rounded-full bg-[#0A192F] text-white flex items-center justify-center font-bold text-xs shadow-2xs group-hover:ring-2 group-hover:ring-[#2563EB] transition">
                {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : "S"}
              </div>
              <div className="hidden lg:block text-left">
                <span className="font-bold text-slate-900 block text-[11px] truncate max-w-[120px] group-hover:text-[#2563EB] transition">
                  {adminUser?.name || "Administrator"}
                </span>
                <span className="text-[10px] text-slate-400 block -mt-0.5 truncate max-w-[120px]">
                  {adminUser?.role || "OWNER"} • @{(adminUser as any)?.username || "admin"}
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* Active TECHNEXT Central Broadcast Announcements */}
        {broadcasts
          .filter((b) => !dismissedIds.includes(b.id))
          .map((b) => (
            <div
              key={b.id}
              className={`border-b px-6 sm:px-8 py-3 text-xs flex items-center justify-between gap-4 transition-all ${
                b.severity === "CRITICAL"
                  ? "bg-rose-50 border-rose-200 text-rose-950"
                  : b.severity === "WARNING"
                  ? "bg-amber-50 border-amber-200 text-amber-950"
                  : "bg-blue-50 border-blue-200 text-blue-950"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell
                  className={`w-4 h-4 flex-shrink-0 ${
                    b.severity === "CRITICAL"
                      ? "text-rose-600 animate-bounce"
                      : b.severity === "WARNING"
                      ? "text-amber-600"
                      : "text-blue-600"
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold uppercase text-[10px] tracking-wider px-1.5 py-0.5 rounded bg-white/80 border border-current">
                      SYSTEM BULLETIN
                    </span>
                    <strong className="font-bold">{b.title}</strong>
                  </div>
                  <p className="text-[11px] opacity-90 mt-0.5">{b.message}</p>
                </div>
              </div>
              <button
                onClick={() => setDismissedIds((prev) => [...prev, b.id])}
                className="p-1 rounded-md hover:bg-black/5 text-slate-500 hover:text-slate-800 transition-colors"
                title="Dismiss Notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

        {/* Expired Persistent Alert Banner if in License Settings */}
        {isExpired && isLicensePage && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 sm:px-8 py-3 text-xs text-rose-900 flex items-center justify-between gap-4 font-semibold">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>
                <strong>CRITICAL: STOREFRONT & BACKOFFICE LOCKED.</strong> Your license has expired ({new Date(licenseInfo?.expiresAt).toLocaleDateString()}). Enter your renewed license key below to immediately restore store operations.
              </span>
            </div>
          </div>
        )}

        {/* Content area: If expired and NOT on license settings, SHOW BLOCKING SCREEN */}
        {isExpired && !isLicensePage ? (
          <div className="flex-1 p-6 sm:p-12 flex items-center justify-center">
            <div className="max-w-lg w-full bg-white rounded-3xl border border-rose-200 p-8 text-center space-y-6 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center border border-rose-200 shadow-sm">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 uppercase tracking-wider">
                  Store Operations Paused
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Admin Panel Locked
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Your AVRO commercial subscription license has expired or is awaiting renewal. Store management operations (Orders, Products, Inventory, Customers) are locked.
                </p>
              </div>

              {/* License Details */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-left space-y-2 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-rose-600">{licenseInfo?.status || "EXPIRED"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Authorized Domain:</span>
                  <span className="font-mono text-slate-700">{licenseInfo?.domain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expired On:</span>
                  <span className="text-slate-800">{new Date(licenseInfo?.expiresAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <Link
                  href="/admin/settings/license"
                  className="w-full py-3 px-4 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4 text-amber-400" />
                  Enter / Edit Renewed License Key
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="mailto:support@technext.co?subject=AVRO%20Subscription%20Renewal%20Inquiry"
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  Contact Account Support (support@technext.co)
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 flex-1">{children}</div>
        )}
      </main>
    </div>
  );
}

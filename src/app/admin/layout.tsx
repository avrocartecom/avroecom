"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Clock,
  Layers,
  BarChart3,
  Archive,
  Gift,
  PackagePlus,
  Users,
  Building2,
  Tag,
  TrendingUp,
  Globe2,
  PieChart,
  UploadCloud,
  Menu as MenuIcon,
  BookOpen,
  Database,
  Palette,
  Store,
  Key,
  CreditCard,
  UserCheck,
  Truck,
  Receipt,
  Globe,
  Bell,
  Sliders,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  Lock,
  ArrowRight,
  LogOut,
  Loader2,
  X,
  Command,
  HelpCircle,
  CheckCircle2,
  Radio,
  Share2,
  Package,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

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

  // Admin Basics: Interactive UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [storeSwitcherOpen, setStoreSwitcherOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Multi-Store Profiles
  const [selectedStore, setSelectedStore] = useState("Main Storefront (Retail INR)");
  const storesList = [
    { name: "Main Storefront (Retail INR)", currency: "INR (₹)", active: true },
    { name: "B2B Wholesale Portal", currency: "INR (Net 30)", active: false },
    { name: "Global Exports (USD)", currency: "USD ($)", active: false },
  ];

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: "nt-1",
      title: "New Order #1048 Received",
      desc: "Priya Sharma placed an order for ₹3,499 (Prepaid UPI)",
      time: "5m ago",
      read: false,
      href: "/admin/orders",
    },
    {
      id: "nt-2",
      title: "Low Inventory Warning",
      desc: "Classic Aviator Sunglasses has 4 units remaining in Delhi Hub",
      time: "24m ago",
      read: false,
      href: "/admin/inventory",
    },
    {
      id: "nt-3",
      title: "Abandoned Checkout Recovered",
      desc: "WhatsApp link converted ₹1,850 cart into paid order #1047",
      time: "2h ago",
      read: true,
      href: "/admin/orders/abandoned",
    },
    {
      id: "nt-4",
      title: "Shiprocket AWB Generated",
      desc: "Delhivery Air Express assigned for Order #1045",
      time: "4h ago",
      read: true,
      href: "/admin/apps/shiprocket",
    },
  ]);

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

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K for search, ? for shortcuts)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      } else if (e.key === "?" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setShortcutsModalOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setSearchModalOpen(false);
        setShortcutsModalOpen(false);
        setNotificationsOpen(false);
        setStoreSwitcherOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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

  if (isLoginPage) {
    return <>{children}</>;
  }

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
            <h2 className="text-sm font-bold tracking-wide uppercase text-white">
              Authenticating Merchant Session
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Verifying encrypted credentials & store permissions...
            </p>
          </div>
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin mt-2" />
        </div>
      </div>
    );
  }

  // --- Complete Merchant Menu Hierarchy ---
  const menuSections = [
    {
      group: "Home",
      items: [{ label: "Home Dashboard", href: "/admin", icon: LayoutDashboard }],
    },
    {
      group: "Orders",
      items: [
        { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
        { label: "Draft Orders", href: "/admin/orders/drafts", icon: FileText },
        { label: "Abandoned Checkouts", href: "/admin/orders/abandoned", icon: Clock },
      ],
    },
    {
      group: "Products",
      items: [
        { label: "Products", href: "/admin/products", icon: Layers },
        { label: "Inventory Control", href: "/admin/inventory", icon: BarChart3 },
        { label: "Collections", href: "/admin/collections", icon: Archive },
        { label: "Gift Cards", href: "/admin/gift-cards", icon: Gift },
        { label: "Combo Deals & Bundles", href: "/admin/combos", icon: PackagePlus },
        { label: "Categories", href: "/admin/categories", icon: Package },
      ],
    },
    {
      group: "Marketing & Customers",
      items: [
        { label: "Discounts & Coupons", href: "/admin/coupons", icon: Tag },
        { label: "Customers", href: "/admin/customers", icon: Users },
        { label: "Customer Segments", href: "/admin/customers/segments", icon: UserCheck },
        { label: "B2B Companies", href: "/admin/customers/companies", icon: Building2 },
        { label: "Growth & Attribution", href: "/admin/growth", icon: TrendingUp },
        { label: "International Markets", href: "/admin/markets", icon: Globe2 },
        { label: "Analytics & Reports", href: "/admin/reports", icon: PieChart },
      ],
    },
    {
      group: "Content & Design",
      items: [
        { label: "Media Library", href: "/admin/media", icon: UploadCloud },
        { label: "Navigation Menus", href: "/admin/content/menus", icon: MenuIcon },
        { label: "Blog Posts", href: "/admin/content/blog", icon: BookOpen },
        { label: "Metaobjects", href: "/admin/content/metaobjects", icon: Database },
        { label: "Themes & Editor", href: "/admin/themes", icon: Palette },
        { label: "Pages & Preferences", href: "/admin/pages", icon: FileText },
      ],
    },
    {
      group: "Apps & Channels",
      items: [
        { label: "Apps Directory", href: "/admin/apps", icon: Package },
        { label: "Shiprocket Logistics", href: "/admin/apps/shiprocket", icon: Truck },
        { label: "Zoho Sync", href: "/admin/apps/zoho", icon: Sliders },
        { label: "Google Sheets Stream", href: "/admin/apps/google-sheets", icon: FileText },
        { label: "WhatsApp & Notifications", href: "/admin/apps/whatsapp", icon: Radio },
        { label: "Print on Demand (POD)", href: "/admin/apps/pod", icon: Layers },
        { label: "Sales Channels Hub", href: "/admin/sales-channels", icon: Share2 },
      ],
    },
    {
      group: "Settings",
      items: [
        { label: "Settings Overview", href: "/admin/settings", icon: Sliders },
        { label: "General & Brand", href: "/admin/settings/general", icon: Store },
        { label: "Plans & Billing", href: "/admin/settings/license", icon: Key },
        { label: "Users & Permissions", href: "/admin/users", icon: Users },
        { label: "Payment Gateways", href: "/admin/settings/payments", icon: CreditCard },
        { label: "Checkout & Accounts", href: "/admin/settings/checkout", icon: UserCheck },
        { label: "Shipping & Delivery", href: "/admin/settings/shipping", icon: Truck },
        { label: "Taxes & GST", href: "/admin/settings/taxes", icon: Receipt },
        { label: "Custom Domains", href: "/admin/settings/domains", icon: Globe },
        { label: "Notifications", href: "/admin/settings/notifications", icon: Bell },
        { label: "Other Settings", href: "/admin/settings/other", icon: Sliders },
      ],
    },
  ];

  const allItems = menuSections.flatMap((s) => s.items);
  const activeLabel = allItems.find((i) => i.href === pathname)?.label || "Administration";
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const isExpired = licenseInfo && !licenseInfo.valid;
  const isLicensePage = pathname === "/admin/settings/license";

  // Filter searchable items for Global Search (Cmd+K)
  const filteredSearchItems = allItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      {/* Search Modal (Cmd+K) */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Jump to any page, product, or order... (Type to search)"
                className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none placeholder-slate-400"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 text-xs">
              {filteredSearchItems.length === 0 ? (
                <div className="p-6 text-center text-slate-400 font-medium">
                  No matching admin pages found for &quot;{searchQuery}&quot;
                </div>
              ) : (
                filteredSearchItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSearchModalOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/80 hover:text-blue-700 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center text-slate-600 group-hover:text-blue-600">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-900 group-hover:text-blue-700">
                          {item.label}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    </Link>
                  );
                })
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Navigation search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-500 font-mono font-bold">
                ESC to close
              </kbd>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Modal (?) */}
      {shortcutsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">Keyboard Shortcuts</h3>
              </div>
              <button
                onClick={() => setShortcutsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs font-medium space-y-2">
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">Global Search Jump</span>
                <kbd className="px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 font-mono font-bold text-slate-800">
                  ⌘K or Ctrl+K
                </kbd>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">Open Keyboard Shortcuts</span>
                <kbd className="px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 font-mono font-bold text-slate-800">
                  ?
                </kbd>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">Dismiss / Close Modals</span>
                <kbd className="px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 font-mono font-bold text-slate-800">
                  ESC
                </kbd>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">Open Storefront</span>
                <kbd className="px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 font-mono font-bold text-slate-800">
                  G then S
                </kbd>
              </div>
            </div>

            <button
              onClick={() => setShortcutsModalOpen(false)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-2xs">
        <div className="flex items-center gap-3">
          {/* Mobile Drawer Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            aria-label="Open menu"
          >
            <MenuIcon className="w-5 h-5" />
          </button>

          {/* Logo & Store Switcher */}
          <div className="flex items-center gap-2">
            <Link href="/admin" className="flex items-center gap-2">
              <img
                src="/avro-logo.png"
                alt="AVRO"
                className="h-6 w-auto object-contain"
              />
            </Link>

            {/* Store Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setStoreSwitcherOpen((prev) => !prev)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-[11px] font-bold border border-slate-200 transition"
              >
                <Store className="w-3.5 h-3.5 text-blue-600" />
                <span className="truncate max-w-[140px]">{selectedStore}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {storeSwitcherOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 text-xs space-y-1">
                  <div className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Switch Active Store
                  </div>
                  {storesList.map((st, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedStore(st.name);
                        setStoreSwitcherOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between font-semibold transition ${
                        selectedStore === st.name
                          ? "bg-blue-50 text-blue-700 font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate">{st.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{st.currency}</span>
                    </button>
                  ))}
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setStoreSwitcherOpen(false);
                        alert("Store creation wizard available in Enterprise Plan.");
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl text-blue-600 font-bold hover:bg-blue-50 flex items-center gap-1.5"
                    >
                      <span>+ Add New Store Profile</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Global Search Bar (Trigger) */}
        <button
          onClick={() => setSearchModalOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200 text-xs text-slate-500 transition w-72 justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search admin pages...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-white text-[10px] font-mono font-bold text-slate-400 border border-slate-200">
            ⌘K
          </kbd>
        </button>

        {/* Header Right Utility Controls */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          {/* Shortcuts Icon Button */}
          <button
            onClick={() => setShortcutsModalOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
            title="Keyboard Shortcuts (?)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Notifications Drawer Toggle */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen((prev) => !prev)}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>

            {/* Notifications Popover */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 z-50 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Store Notifications</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black">
                      {unreadNotificationCount} unread
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setNotifications(notifications.map((n) => ({ ...n, read: true })));
                    }}
                    className="text-[11px] text-blue-600 hover:underline font-bold"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto space-y-1">
                  {notifications.map((n) => (
                    <Link
                      key={n.id}
                      href={n.href}
                      onClick={() => setNotificationsOpen(false)}
                      className={`block p-2.5 rounded-xl transition ${
                        n.read ? "hover:bg-slate-50 text-slate-600" : "bg-blue-50/50 hover:bg-blue-50 text-slate-900"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px]">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Store Live Pill */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px] hover:bg-emerald-100 transition"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Storefront</span>
            <ExternalLink className="w-3 h-3 text-emerald-600" />
          </Link>

          {/* Admin Profile Chip */}
          <Link
            href="/admin/profile"
            className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:opacity-80 transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[#0A192F] text-white flex items-center justify-center font-bold text-xs shadow-2xs group-hover:ring-2 group-hover:ring-blue-500">
              {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : "A"}
            </div>
          </Link>
        </div>
      </header>

      {/* Main Framework: Sidebar + Viewport */}
      <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 bg-white border-r border-slate-200/80 flex-shrink-0 flex-col justify-between overflow-y-auto">
          <div className="p-3 space-y-4">
            {menuSections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {sec.group}
                </div>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
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
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-200/80 space-y-1.5 text-xs">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold transition-colors border border-rose-200/60 text-xs"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
              </div>
            </button>
          </div>
        </aside>

        {/* Mobile Slide-Over Drawer (Phone Layout) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full flex flex-col justify-between overflow-y-auto p-4 animate-in slide-in-from-left duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <img src="/avro-logo.png" alt="AVRO" className="h-6 w-auto" />
                    <span className="font-extrabold text-xs text-slate-900">STORE ADMIN</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {menuSections.map((sec, sIdx) => (
                  <div key={sIdx} className="space-y-1">
                    <div className="px-2 py-0.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      {sec.group}
                    </div>
                    {sec.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isActive
                              ? "bg-[#0A192F] text-white font-bold"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-3 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs"
                >
                  Sign Out
                </button>
              </div>
            </div>

            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Viewport Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Active Broadcast Announcements */}
          {broadcasts
            .filter((b) => !dismissedIds.includes(b.id))
            .map((b) => (
              <div
                key={b.id}
                className={`border-b px-6 py-3 text-xs flex items-center justify-between gap-4 transition-all ${
                  b.severity === "CRITICAL"
                    ? "bg-rose-50 border-rose-200 text-rose-950"
                    : b.severity === "WARNING"
                    ? "bg-amber-50 border-amber-200 text-amber-950"
                    : "bg-blue-50 border-blue-200 text-blue-950"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 flex-shrink-0 text-blue-600" />
                  <div>
                    <strong className="font-bold">{b.title}: </strong>
                    <span>{b.message}</span>
                  </div>
                </div>
                <button
                  onClick={() => setDismissedIds((prev) => [...prev, b.id])}
                  className="p-1 rounded-md hover:bg-black/5 text-slate-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

          {/* Expired Persistent Alert */}
          {isExpired && isLicensePage && (
            <div className="bg-rose-50 border-b border-rose-200 px-6 py-3 text-xs text-rose-900 flex items-center gap-2 font-semibold">
              <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>
                <strong>CRITICAL: STOREFRONT & BACKOFFICE LOCKED.</strong> Your license has expired ({new Date(licenseInfo?.expiresAt).toLocaleDateString()}). Enter your renewed license key below to restore store operations.
              </span>
            </div>
          )}

          {isExpired && !isLicensePage ? (
            <div className="flex-1 p-6 sm:p-12 flex items-center justify-center">
              <div className="max-w-lg w-full bg-white rounded-3xl border border-rose-200 p-8 text-center space-y-6 shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center border border-rose-200">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 uppercase">
                    Store Operations Paused
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900">Admin Panel Locked</h2>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Your AVRO license subscription has expired. Enter your renewed key to unlock.
                  </p>
                </div>
                <Link
                  href="/admin/settings/license"
                  className="w-full py-3 px-4 rounded-xl bg-[#0A192F] text-white text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4 text-amber-400" />
                  Enter Renewed License Key
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-8 flex-1">{children}</div>
          )}
        </main>
      </div>
    </div>
  );
}

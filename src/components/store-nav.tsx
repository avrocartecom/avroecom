"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  User,
  UserPlus,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Package,
  Shield,
  Zap,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useState, useEffect, useRef } from "react";
import { AVRO_THEMES, resolveStoreTheme } from "@/lib/themes-registry";

interface CustomerUser {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
  ordersCount?: number;
  wishlistCount?: number;
}

export function StoreNav({ theme }: { theme?: any }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const previewParam = searchParams?.get("theme") || searchParams?.get("previewTheme");
  const matchingThemeDef = resolveStoreTheme(previewParam || theme?.activeTheme, theme);

  const brandName = theme?.brandName || `${matchingThemeDef.name} Store`;
  const announcementText = theme?.announcementBarText || matchingThemeDef.announcementBar.text;
  const showAnnouncement = theme?.showAnnouncementBar ?? true;

  const isDarkNav =
    matchingThemeDef.palette.headerBg === "#090D16" ||
    matchingThemeDef.palette.headerBg === "#09090B" ||
    matchingThemeDef.palette.headerBg === "#0A0A0A";

  // Check customer login status
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/customer/auth/me");
      const data = await res.json();
      if (data.authenticated && data.customer) {
        setCustomer(data.customer);
      } else {
        setCustomer(null);
      }
    } catch {
      setCustomer(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Quick Guest Login
  const handleInstantGuestLogin = async () => {
    try {
      const res = await fetch("/api/customer/auth/guest", { method: "POST" });
      const data = await res.json();
      if (data.success && data.customer) {
        setCustomer(data.customer);
        setUserDropdownOpen(false);
        router.refresh();
      }
    } catch (e) {
      console.warn("Guest login failed:", e);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/customer/auth/logout", { method: "POST" });
      setCustomer(null);
      setUserDropdownOpen(false);
      router.push("/");
      router.refresh();
    } catch (e) {
      console.warn("Logout error:", e);
    }
  };

  return (
    <header
      className="sticky top-0 z-40 transition-all duration-300 border-b backdrop-blur-sm"
      style={{
        backgroundColor: matchingThemeDef.palette.headerBg,
        borderColor: matchingThemeDef.palette.border,
      }}
    >
      {/* Announcement Bar - scrolling marquee */}
      {showAnnouncement && (
        <div
          className="py-1.5 overflow-hidden transition-colors"
          style={{
            backgroundColor: matchingThemeDef.announcementBar.bg,
            color: matchingThemeDef.announcementBar.textColor,
          }}
        >
          <div className="avro-marquee text-xs font-semibold tracking-wide select-none">
            {/* Duplicate for seamless loop */}
            {[0, 1].map((i) => (
              <span key={i} className="flex items-center gap-8 px-4 whitespace-nowrap">
                {announcementText}
                <span className="opacity-40">·</span>
                {announcementText}
                <span className="opacity-40">·</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-lg border border-slate-200/80 shadow-xs flex-shrink-0 flex items-center justify-center">
            <img
              src={theme?.logoUrl || "/avro-logo.png"}
              alt={brandName}
              className="h-8 max-w-[140px] w-auto object-contain"
            />
          </div>
          <div>
            <span
              className={`font-extrabold text-base tracking-tight block leading-tight ${
                isDarkNav ? "text-white" : "text-slate-900"
              }`}
              style={{ fontFamily: matchingThemeDef.typography.fontFamily }}
            >
              {brandName}
            </span>
            <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block">
              {matchingThemeDef.industry}
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold">
          <Link
            href="/"
            className={`avro-link-underline transition-colors ${
              pathname === "/"
                ? "font-bold"
                : isDarkNav
                ? "text-slate-300 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
            style={pathname === "/" ? { color: matchingThemeDef.palette.accent } : {}}
          >
            Home
          </Link>
          <Link
            href="/shop"
            className={`avro-link-underline transition-colors ${
              pathname === "/shop"
                ? "font-bold"
                : isDarkNav
                ? "text-slate-300 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
            style={pathname === "/shop" ? { color: matchingThemeDef.palette.accent } : {}}
          >
            Shop Catalog
          </Link>
          <Link
            href="/wishlist"
            className={`avro-link-underline transition-colors ${
              pathname === "/wishlist"
                ? "font-bold"
                : isDarkNav
                ? "text-slate-300 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
            style={pathname === "/wishlist" ? { color: matchingThemeDef.palette.accent } : {}}
          >
            Wishlist
          </Link>
          <Link
            href="/track"
            className={`avro-link-underline transition-colors ${
              pathname === "/track"
                ? "font-bold"
                : isDarkNav
                ? "text-slate-300 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
            style={pathname === "/track" ? { color: matchingThemeDef.palette.accent } : {}}
          >
            Track Order
          </Link>
          <Link
            href="/about"
            className={`avro-link-underline transition-colors ${
              pathname === "/about"
                ? "font-bold"
                : isDarkNav
                ? "text-slate-300 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
            style={pathname === "/about" ? { color: matchingThemeDef.palette.accent } : {}}
          >
            About Us
          </Link>
        </nav>

        {/* Action icons (Wishlist + Cart + Account) */}
        <div className="flex items-center gap-2.5">
          {/* Wishlist Button with Counter */}
          <Link
            href="/wishlist"
            className={`relative p-2.5 rounded-xl transition-colors flex items-center ${
              isDarkNav
                ? "bg-slate-800 text-white hover:bg-slate-700"
                : "bg-slate-100 text-slate-800 hover:bg-slate-200"
            }`}
            title="My Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlistCount > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Drawer Link with Counter */}
          <Link
            href="/cart"
            className={`relative p-2.5 rounded-xl transition-colors flex items-center ${
              isDarkNav
                ? "bg-slate-800 text-white hover:bg-slate-700"
                : "bg-slate-100 text-slate-800 hover:bg-slate-200"
            }`}
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {itemCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow"
                style={{ backgroundColor: matchingThemeDef.palette.accent }}
              >
                {itemCount}
              </span>
            )}
          </Link>

          {/* Customer / Guest Account Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className={`flex items-center gap-1.5 p-2 px-2.5 rounded-xl transition-colors text-xs font-bold ${
                isDarkNav
                  ? "bg-slate-800 text-white hover:bg-slate-700"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200"
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline max-w-[100px] truncate">
                {customer ? (customer.isGuest ? "Guest" : customer.name.split(" ")[0]) : "Sign In"}
              </span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 space-y-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                {customer ? (
                  <>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="font-extrabold text-slate-900 truncate">{customer.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{customer.email}</p>
                      {customer.isGuest && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[9px] font-black uppercase rounded">
                          Guest Shopper
                        </span>
                      )}
                    </div>

                    {!customer.isGuest && (
                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg text-slate-700 font-semibold transition"
                      >
                        <Package className="w-3.5 h-3.5 text-blue-600" />
                        <span>My Orders & Profile</span>
                      </Link>
                    )}

                    <Link
                      href="/wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg text-slate-700 font-semibold transition"
                    >
                      <div className="flex items-center gap-2">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span>Saved Wishlist</span>
                      </div>
                      {wishlistCount > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-rose-50 text-rose-600 rounded-full">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>

                    {customer.isGuest ? (
                      <Link
                        href="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 p-2 hover:bg-blue-50 text-blue-600 rounded-lg font-bold transition"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Create Full Account</span>
                      </Link>
                    ) : null}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 p-2 hover:bg-rose-50 text-rose-600 rounded-lg font-semibold transition text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{customer.isGuest ? "Exit Guest Mode" : "Log Out"}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="p-2 border-b border-slate-100">
                      <p className="text-[11px] font-bold text-slate-800">Welcome to {brandName}</p>
                      <p className="text-[10px] text-slate-400">Track orders and save wishlist</p>
                    </div>

                    <Link
                      href="/login"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 p-2 hover:bg-slate-50 text-slate-800 font-bold rounded-lg transition"
                    >
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      <span>Log In to Account</span>
                    </Link>

                    <Link
                      href="/login?tab=register"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 p-2 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-blue-600" />
                      <span>Create New Account</span>
                    </Link>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={handleInstantGuestLogin}
                      className="w-full flex items-center justify-between p-2 bg-blue-50/70 hover:bg-blue-100/70 text-blue-800 rounded-lg font-bold transition text-left"
                    >
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-blue-600" />
                        <span>Continue as Guest</span>
                      </div>
                      <span className="text-[9px] font-mono text-blue-500 uppercase">1-Click</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors ${
              isDarkNav ? "text-slate-200 hover:bg-white/10" : "text-slate-700 hover:bg-slate-100"
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Responsive Themed Drawer */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t transition-all duration-300 p-4 space-y-4 animate-in slide-in-from-top-2 shadow-2xl"
          style={{
            backgroundColor: matchingThemeDef.palette.headerBg,
            borderColor: matchingThemeDef.palette.border,
            color: isDarkNav ? "#F1F5F9" : "#0F172A",
          }}
        >
          {/* Quick Search Jump for Mobile */}
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-semibold transition"
            style={{
              backgroundColor: isDarkNav ? "rgba(255,255,255,0.06)" : "#F8FAFC",
              borderColor: isDarkNav ? "rgba(255,255,255,0.12)" : "#E2E8F0",
              color: isDarkNav ? "#CBD5E1" : "#64748B",
            }}
          >
            <span className="text-[11px]">Search products, collections, brands...</span>
          </Link>

          {/* Navigation Links with Theme Accents */}
          <div className="space-y-1 text-sm font-bold divide-y divide-black/5 dark:divide-white/5">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between py-2.5 px-2 rounded-lg transition-colors ${
                pathname === "/" ? "font-extrabold" : "opacity-80 hover:opacity-100"
              }`}
              style={pathname === "/" ? { color: matchingThemeDef.palette.accent } : {}}
            >
              <span>Home</span>
              {pathname === "/" && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
            </Link>

            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between py-2.5 px-2 rounded-lg transition-colors ${
                pathname === "/shop" ? "font-extrabold" : "opacity-80 hover:opacity-100"
              }`}
              style={pathname === "/shop" ? { color: matchingThemeDef.palette.accent } : {}}
            >
              <span>Shop All Products</span>
              {pathname === "/shop" && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
            </Link>

            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 px-2 rounded-lg opacity-80 hover:opacity-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Heart className={`w-4 h-4 ${wishlistCount > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
                <span>My Wishlist</span>
              </div>
              {wishlistCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between py-2.5 px-2 rounded-lg transition-colors ${
                pathname === "/track" ? "font-extrabold" : "opacity-80 hover:opacity-100"
              }`}
              style={pathname === "/track" ? { color: matchingThemeDef.palette.accent } : {}}
            >
              <span>Track Orders</span>
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between py-2.5 px-2 rounded-lg transition-colors ${
                pathname === "/about" ? "font-extrabold" : "opacity-80 hover:opacity-100"
              }`}
              style={pathname === "/about" ? { color: matchingThemeDef.palette.accent } : {}}
            >
              <span>About Us</span>
            </Link>
          </div>

          {/* Customer Profile / Sign In Section for Mobile */}
          <div
            className="pt-3 border-t space-y-2.5"
            style={{ borderColor: isDarkNav ? "rgba(255,255,255,0.08)" : "#E2E8F0" }}
          >
            {customer ? (
              <div
                className="p-3 rounded-2xl border space-y-2"
                style={{
                  backgroundColor: isDarkNav ? "rgba(255,255,255,0.04)" : "#F8FAFC",
                  borderColor: isDarkNav ? "rgba(255,255,255,0.08)" : "#E2E8F0",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-extrabold text-xs truncate">{customer.name}</p>
                    <p className="text-[10px] opacity-60 font-mono truncate">{customer.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-rose-500 font-bold hover:underline ml-2"
                  >
                    Log Out
                  </button>
                </div>
                {!customer.isGuest && (
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                    style={{ backgroundColor: matchingThemeDef.palette.accent }}
                  >
                    Manage Orders & Account
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 px-3 text-white rounded-xl text-xs font-bold shadow-xs transition"
                  style={{ backgroundColor: matchingThemeDef.palette.primary }}
                >
                  Sign In
                </Link>
                <button
                  onClick={handleInstantGuestLogin}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold border transition text-center"
                  style={{
                    backgroundColor: isDarkNav ? "rgba(255,255,255,0.08)" : "#F1F5F9",
                    borderColor: isDarkNav ? "rgba(255,255,255,0.12)" : "#E2E8F0",
                    color: isDarkNav ? "#FFFFFF" : "#1E293B",
                  }}
                >
                  Guest Shopper
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}


import prisma from "@/lib/prisma";
import Link from "next/link";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { StoreNav } from "@/components/store-nav";
import StoreFooter from "@/components/store-footer";
import { ThemePreviewDock } from "@/components/theme-preview-dock";
import { getStoreLicenseStatus } from "@/lib/license-client";
import { AlertOctagon, Key, ShieldAlert, ArrowRight, ExternalLink, RefreshCw } from "lucide-react";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await prisma.storeThemeSetting.findFirst();
  const licenseStatus = await getStoreLicenseStatus();

  // If the license is expired, suspended, revoked, or unactivated, BLOCK THE PUBLIC WEBSITE
  if (!licenseStatus.valid) {
    const brandName = theme?.brandName || "AVRO Store";

    return (
      <div className="min-h-screen bg-[#070D18] text-white flex flex-col justify-between font-sans">
        {/* Top Emergency Notice Header */}
        <div className="bg-rose-950/80 border-b border-rose-800/60 px-4 py-2.5 text-center text-xs font-bold text-rose-200 flex items-center justify-center gap-2">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <span>STOREFRONT SUSPENDED · SOFTWARE SUBSCRIPTION EXPIRED OR PENDING RENEWAL</span>
        </div>

        {/* Center Suspended Message Block */}
        <main className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
          <div className="bg-white px-4 py-2 rounded-2xl inline-block shadow-md mx-auto">
            <img
              src="/avro-logo.png"
              alt="AVRO"
              className="h-10 w-auto object-contain"
            />
          </div>

          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-bold">
              {brandName}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Storefront Temporarily Offline
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-lg mx-auto">
              This independent store has been paused because its commercial software license has expired or is awaiting renewal.
            </p>
          </div>

          {/* License Diagnostics Details Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-left text-xs space-y-3 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">License Status:</span>
              <span className="font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/40 uppercase">
                {licenseStatus.status}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Authorized Domain:</span>
              <span className="font-mono text-slate-200">{licenseStatus.domain}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Subscription Tier:</span>
              <span className="font-bold text-slate-200">AVRO {licenseStatus.plan}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Expiration Timestamp:</span>
              <span className="text-slate-300 font-mono">
                {new Date(licenseStatus.expiresAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Action Buttons for Store Owner */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/admin/settings/license"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <Key className="w-4 h-4" />
              Store Owner: Update / Renew License
            </Link>
            <a
              href="mailto:support@technext.co?subject=AVRO%20Storefront%20License%20Renewal"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-all"
            >
              Contact Support (support@technext.co)
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-[11px] text-slate-500 pt-4">
            If you are a customer, please contact the store merchant. If you are the store administrator, log into your admin panel to apply your renewed license key.
          </p>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
          Powered by <strong className="text-slate-400">AVRO</strong>
        </footer>
      </div>
    );
  }

  // Active / Valid License: Normal Storefront
  return (
    <CartProvider>
      <WishlistProvider>
        {theme?.faviconUrl && (
          <head>
            <link rel="icon" href={theme.faviconUrl} />
            <link rel="apple-touch-icon" href={theme.faviconUrl} />
          </head>
        )}
        <div
          className="min-h-screen flex flex-col transition-colors duration-300"
          style={{
            fontFamily: theme?.fontFamily || "Inter, -apple-system, sans-serif",
          }}
        >
          <StoreNav theme={theme} />
          <main className="flex-grow">{children}</main>
          <StoreFooter theme={theme} />
          <ThemePreviewDock initialThemeCode={theme?.activeTheme} />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AVRO_THEMES, AvroThemeDefinition } from "@/lib/themes-registry";
import {
  Palette,
  Check,
  ChevronUp,
  ChevronDown,
  Zap,
  Sliders,
  CheckCircle2,
} from "lucide-react";

export function ThemePreviewDock({ initialThemeCode }: { initialThemeCode?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentParam = searchParams.get("theme") || searchParams.get("previewTheme");
  const isPreviewMode = searchParams.get("preview") === "true" || !!currentParam;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  // If not explicitly previewing with ?theme= or ?preview=true, do not display dock on storefront
  if (!isPreviewMode) {
    return null;
  }

  const activeThemeCode = currentParam || initialThemeCode || "AVRO_SIGNATURE";
  const activeTheme =
    AVRO_THEMES.find(
      (t) =>
        t.code === activeThemeCode ||
        t.id === activeThemeCode ||
        t.id === currentParam ||
        t.code.toLowerCase() === activeThemeCode.toLowerCase() ||
        (activeThemeCode.toUpperCase() === "TALIM_DEFAULT" && t.code === "AVRO_SIGNATURE")
    ) || AVRO_THEMES[12];

  const handleSelectTheme = (themeId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("theme", themeId);
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const handleApplyPermanent = async (theme: AvroThemeDefinition) => {
    setIsApplying(true);
    try {
      const payload = {
        activeTheme: theme.code,
        brandName: `${theme.name} Store`,
        primaryColor: theme.palette.primary,
        accentColor: theme.palette.accent,
        fontFamily: theme.typography.fontFamily,
        bannerHeadline: `${theme.hero.headline} ${theme.hero.headlineHighlight || ""}`.trim(),
        bannerSubheadline: theme.hero.subheadline,
        bannerImageUrl: theme.hero.imageUrl,
        announcementBarText: theme.announcementBar.text,
        showAnnouncementBar: true,
      };

      const res = await fetch("/api/admin/themes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setAppliedNotice(`Applied ${theme.name} as permanent store theme!`);
        setTimeout(() => setAppliedNotice(null), 3500);
      }
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
      {/* Expanded Theme Tray */}
      {isExpanded && (
        <div className="mb-2 bg-slate-950/95 text-white backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold tracking-wide">AVRO Theme Engine</span>
              <span className="text-slate-400">· Select any of the 13 reference industry archetypes</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {appliedNotice && (
            <div className="bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs py-1.5 px-3 rounded-lg flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {appliedNotice}
            </div>
          )}

          {/* Grid of 13 themes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 max-h-56 overflow-y-auto pr-1">
            {AVRO_THEMES.map((theme) => {
              const isSelected =
                activeTheme.code === theme.code || activeTheme.id === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme.id)}
                  className={`text-left p-2 rounded-xl border text-[11px] transition-all flex flex-col justify-between ${
                    isSelected
                      ? "bg-blue-600/30 border-blue-500 ring-1 ring-blue-400 text-white"
                      : "bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold truncate">{theme.name}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-white/20"
                      style={{ backgroundColor: theme.palette.primary }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 line-clamp-1">{theme.industry}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Apply / Go to Admin */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
            <div className="text-slate-400 text-[11px]">
              Active Preview: <strong className="text-white">{activeTheme.name}</strong> ({activeTheme.industry})
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={isApplying}
                onClick={() => handleApplyPermanent(activeTheme)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                {isApplying ? "Saving to Store..." : "Save as Default Store Theme"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Dock Pill */}
      <div className="bg-slate-950/90 text-white backdrop-blur-md border border-slate-800 rounded-full px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <Palette className="w-3.5 h-3.5" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-white">{activeTheme.name}</span>
            <span className="hidden sm:inline text-slate-400 ml-1.5">({activeTheme.industry})</span>
          </div>
        </div>

        {/* Quick swatch indicators */}
        <div className="hidden sm:flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full border border-white/20"
            style={{ backgroundColor: activeTheme.palette.primary }}
            title="Primary"
          />
          <span
            className="w-3 h-3 rounded-full border border-white/20"
            style={{ backgroundColor: activeTheme.palette.accent }}
            title="Accent"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-bold flex items-center gap-1 text-slate-200 transition-colors"
          >
            <span>Switch Theme ({AVRO_THEMES.length})</span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

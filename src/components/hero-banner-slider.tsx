"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Play,
  Film,
  Sparkles,
  Tag,
  Star,
} from "lucide-react";
import { AvroThemeDefinition } from "@/lib/themes-registry";

export interface HeroBannerSlide {
  id: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

interface HeroBannerSliderProps {
  slides?: HeroBannerSlide[];
  fallbackImage: string;
  fallbackTitle: string;
  fallbackTagline: string;
  themeDef: AvroThemeDefinition;
  isDarkHero: boolean;
  primaryColor: string;
  accentColor: string;
  buttonRadius: string;
}

export function HeroBannerSlider({
  slides = [],
  fallbackImage,
  fallbackTitle,
  fallbackTagline,
  themeDef,
  isDarkHero,
  primaryColor,
  accentColor,
  buttonRadius,
}: HeroBannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  const activeSlides = Array.isArray(slides) && slides.length > 0 ? slides : [];
  const totalSlides = activeSlides.length;

  // Auto right-scroll timer every 5.5 seconds unless hovered/paused
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5500);

    return () => clearInterval(timer);
  }, [totalSlides, isPaused]);

  // Restart video when active slide changes
  useEffect(() => {
    if (totalSlides > 0 && activeSlides[currentIndex]?.mediaType === "video") {
      const vid = videoRefs.current[currentIndex];
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      }
    }
  }, [currentIndex, totalSlides]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const btnRadiusStyle =
    buttonRadius === "rounded-full"
      ? "9999px"
      : buttonRadius === "rounded-none"
      ? "0px"
      : buttonRadius === "rounded-2xl"
      ? "16px"
      : "12px";

  // If no banner slides configured, render single fallback image
  if (totalSlides === 0) {
    return (
      <div
        className="relative overflow-hidden aspect-[4/5] shadow-2xl border transition-all group"
        style={{
          borderColor: isDarkHero ? "rgba(255,255,255,0.1)" : themeDef.palette.border,
          borderRadius: themeDef.typography.buttonRadius === "rounded-none" ? "0px" : "24px",
        }}
      >
        <img
          src={fallbackImage}
          alt={fallbackTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Floating card at bottom */}
        <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-between avro-fade-in-delay-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block">
              Featured Collection
            </span>
            <strong className="text-sm font-extrabold block">{fallbackTitle}</strong>
            <span className="text-[11px] text-slate-200 line-clamp-1">{fallbackTagline}</span>
          </div>
          <Link
            href="/shop"
            className="avro-btn p-2 rounded-lg bg-white text-slate-900 font-bold hover:bg-slate-100 flex-shrink-0"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Decorative corner accent */}
        <div
          className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 flex items-center justify-center backdrop-blur-sm"
          style={{ borderColor: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.1)" }}
        >
          <Star className="w-3.5 h-3.5 text-white fill-white" />
        </div>
      </div>
    );
  }

  const currentSlide = activeSlides[currentIndex];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden aspect-[4/5] shadow-2xl border transition-all group select-none"
      style={{
        borderColor: isDarkHero ? "rgba(255,255,255,0.15)" : themeDef.palette.border,
        borderRadius: themeDef.typography.buttonRadius === "rounded-none" ? "0px" : "24px",
      }}
    >
      {/* Slides Container with Smooth Right-Scroll Transition */}
      <div
        className="flex w-full h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {activeSlides.map((slide, idx) => (
          <div key={slide.id || idx} className="w-full h-full flex-shrink-0 relative bg-slate-950">
            {slide.mediaType === "video" ? (
              <video
                ref={(el) => {
                  videoRefs.current[idx] = el;
                }}
                src={slide.mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={slide.mediaUrl}
                alt={slide.title || "Banner Ad"}
                className="w-full h-full object-cover"
                loading={idx === 0 ? "eager" : "lazy"}
              />
            )}

            {/* Gradient Darkening Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30" />
          </div>
        ))}
      </div>

      {/* Top Banner Tag & Media Indicator */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-sm">
          {currentSlide?.badge ? (
            <>
              <Tag className="w-3 h-3 text-amber-400" />
              <span>{currentSlide.badge}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>FEATURED AD</span>
            </>
          )}
        </span>

        <div className="flex items-center gap-2">
          {currentSlide?.mediaType === "video" && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-600/90 text-white flex items-center gap-1 backdrop-blur-sm shadow-xs">
              <Film className="w-2.5 h-2.5" /> VIDEO
            </span>
          )}

          {/* Slide Progress Counter Pill */}
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/60 text-slate-200 border border-white/20 backdrop-blur-sm">
            {currentIndex + 1} / {totalSlides}
          </span>
        </div>
      </div>

      {/* Floating Bottom Card: Ad Title, Subtitle, & CTA */}
      <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/75 backdrop-blur-md border border-white/20 text-white z-10 transition-all shadow-xl">
        <div className="space-y-1 mb-3">
          {currentSlide?.badge && (
            <span className="text-[9px] uppercase font-black tracking-widest text-amber-400 block">
              {currentSlide.badge}
            </span>
          )}
          <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug line-clamp-1">
            {currentSlide?.title || fallbackTitle}
          </h3>
          {currentSlide?.subtitle && (
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {currentSlide.subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-white/10">
          {currentSlide?.ctaLink ? (
            <Link
              href={currentSlide.ctaLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white transition-all hover:scale-105 shadow-sm"
              style={{
                backgroundColor: accentColor,
                borderRadius: btnRadiusStyle,
              }}
            >
              <span>{currentSlide.ctaText || "Claim Offer"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white transition-all hover:scale-105 shadow-sm"
              style={{
                backgroundColor: primaryColor,
                borderRadius: btnRadiusStyle,
              }}
            >
              <span>Explore Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {/* Pagination Navigation Dots */}
          <div className="flex items-center gap-1.5">
            {activeSlides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentIndex(dotIdx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === dotIdx
                    ? "w-5 bg-white shadow-sm"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Scroll & Left Scroll Control Buttons */}
      {totalSlides > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 backdrop-blur-sm border border-white/20 cursor-pointer shadow-md"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 backdrop-blur-sm border border-white/20 cursor-pointer shadow-md"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}

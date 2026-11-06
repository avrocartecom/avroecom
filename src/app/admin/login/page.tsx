"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Cpu,
  Store,
  Building2,
  Loader2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function StoreAdminLoginPage() {
  const router = useRouter();

  // Store Brand Details
  const [storeBrand, setStoreBrand] = useState<{
    name: string;
    logoUrl?: string;
  }>({
    name: "AVRO Store",
    logoUrl: "",
  });

  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"CREDENTIALS" | "2FA">("CREDENTIALS");
  const [twoFactorPin, setTwoFactorPin] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);

  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Fetch Store Branding (Logo & Name)
  useEffect(() => {
    fetch("/api/admin/settings/general")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setStoreBrand({
            name: data.settings.brandName || "AVRO Store",
            logoUrl: data.settings.logoUrl || "",
          });
        }
      })
      .catch(() => {});
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds === null || lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Empty", color: "bg-slate-700" };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-rose-500" };
    if (score === 2) return { score: 2, label: "Moderate", color: "bg-amber-500" };
    if (score === 3) return { score: 3, label: "Strong", color: "bg-blue-500" };
    return { score: 4, label: "Maximum Enterprise", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(password);

  // Handle Step 1 (Credentials)
  const handleVerifyCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds && lockoutSeconds > 0) return;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, password, step: "CREDENTIALS" }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.isLocked && data.remainingSeconds) {
          setLockoutSeconds(data.remainingSeconds);
        }
        setErrorMessage(data.error || "Authentication failed. Check your store backoffice credentials.");
        return;
      }

      setSuccessMessage("Credentials authenticated. Complete 2FA security step.");
      setStep("2FA");
      setTimeout(() => {
        pinRefs[0].current?.focus();
      }, 100);
    } catch (err: any) {
      setErrorMessage("Network error connecting to store authentication service.");
    } finally {
      setLoading(false);
    }
  };

  // Handle 2FA Pin Input
  const handlePinChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;

    const newPin = [...twoFactorPin];
    newPin[index] = val;
    setTwoFactorPin(newPin);

    // Auto focus next input
    if (val && index < 5) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !twoFactorPin[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const handlePinPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newPin = [...twoFactorPin];
    for (let i = 0; i < 6; i++) {
      newPin[i] = pasted[i] || "";
    }
    setTwoFactorPin(newPin);
    const lastFilled = Math.min(pasted.length, 5);
    pinRefs[lastFilled].current?.focus();
  };

  // Handle Step 2 (2FA Submit)
  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPin = twoFactorPin.join("");
    if (fullPin.length !== 6) {
      setErrorMessage("Please enter all 6 digits of your backoffice security PIN.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          twoFactorCode: fullPin,
          step: "2FA",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Invalid 2FA security code.");
        return;
      }

      setSuccessMessage("Backoffice session authorized! Redirecting to merchant administration...");
      setTimeout(() => {
        router.push("/admin");
      }, 700);
    } catch (err: any) {
      setErrorMessage("Failed to finalize 2FA authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060D1A] flex flex-col justify-between text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background Subtle Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="border-b border-slate-800/80 bg-[#0A1628]/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between text-xs z-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-white px-2 py-0.5 rounded-md shadow-xs">
              <img
                src={storeBrand.logoUrl || "/avro-logo.png"}
                alt={storeBrand.name}
                className="h-5 w-auto object-contain max-w-[120px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/avro-logo.png";
                }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-wider">
              STORE BACKOFFICE
            </span>
          </Link>
          <span className="hidden sm:inline-block h-3.5 w-px bg-slate-700" />
          <span className="hidden sm:flex items-center gap-1.5 text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            TLS 256-Bit Cryptographic Boundary
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/"
            className="text-slate-400 hover:text-white transition-colors text-xs flex items-center gap-1 font-semibold"
          >
            <span>Live Storefront</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 z-10">
        <div className="w-full max-w-md">
          {/* Lockout Warning Banner */}
          {lockoutSeconds && lockoutSeconds > 0 && (
            <div className="mb-4 p-4 rounded-2xl bg-rose-950/70 border border-rose-500/50 text-rose-200 flex items-start gap-3 animate-pulse shadow-lg">
              <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-rose-300">DEFENSIVE LOCKOUT ACTIVATED</p>
                <p className="text-rose-200">
                  Multiple unauthorized login attempts detected. Portal access is frozen for{" "}
                  <span className="font-mono font-bold text-white bg-rose-900/80 px-1.5 py-0.5 rounded">
                    {lockoutSeconds}s
                  </span>
                  .
                </p>
              </div>
            </div>
          )}

          {/* Card Container with Minimal Ambient Pulse Animation */}
          <div className="relative group">
            {/* Minimal Animation: Subtle animated ambient glowing halo */}
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-blue-600/30 via-indigo-500/40 to-emerald-500/30 blur-sm opacity-70 group-hover:opacity-100 transition duration-1000 animate-pulse pointer-events-none" />

            <div className="relative bg-[#0B1A30] border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 backdrop-blur-xl">
              {/* Header with Store Logo */}
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200 inline-flex items-center justify-center max-w-[200px] h-14">
                    <img
                      src={storeBrand.logoUrl || "/avro-logo.png"}
                      alt={storeBrand.name}
                      className="max-h-9 w-auto object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/avro-logo.png";
                      }}
                    />
                  </div>
                </div>

                <div>
                  <h1 className="text-lg font-black tracking-tight text-white">
                    {storeBrand.name} Backoffice
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    {step === "CREDENTIALS"
                      ? "Enter your merchant owner credentials to access store operations."
                      : "Enter your 6-digit security PIN to authorize merchant session."}
                  </p>
                </div>
              </div>

              {/* Error and Success Notifications */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* STEP 1: CREDENTIALS */}
              {step === "CREDENTIALS" && (
                <form onSubmit={handleVerifyCredentials} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Administrator Email or Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        disabled={Boolean(lockoutSeconds && lockoutSeconds > 0) || loading}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="storeadmin@example.com or storeadmin"
                        className="w-full bg-[#061120] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        Store Password
                      </label>
                      <span className="text-[10px] text-slate-400">Minimum 8 characters</span>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        disabled={Boolean(lockoutSeconds && lockoutSeconds > 0) || loading}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-[#061120] border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Entropy Meter */}
                    {password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">Password Strength:</span>
                          <span
                            className={`font-semibold ${
                              strength.score >= 3
                                ? "text-emerald-400"
                                : strength.score === 2
                                ? "text-amber-400"
                                : "text-rose-400"
                            }`}
                          >
                            {strength.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 h-1.5">
                          <div
                            className={`rounded-full transition-all ${
                              strength.score >= 1 ? strength.color : "bg-slate-800"
                            }`}
                          />
                          <div
                            className={`rounded-full transition-all ${
                              strength.score >= 2 ? strength.color : "bg-slate-800"
                            }`}
                          />
                          <div
                            className={`rounded-full transition-all ${
                              strength.score >= 3 ? strength.color : "bg-slate-800"
                            }`}
                          />
                          <div
                            className={`rounded-full transition-all ${
                              strength.score >= 4 ? strength.color : "bg-slate-800"
                            }`}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={Boolean(lockoutSeconds && lockoutSeconds > 0) || loading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-950/40 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 animate-spin" />
                        Verifying Credentials...
                      </span>
                    ) : (
                      <>
                        <span>Proceed to 2FA Security Check</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2: 2FA VERIFICATION */}
              {step === "2FA" && (
                <form onSubmit={handleVerify2FA} className="space-y-5">
                  <div className="p-3.5 rounded-xl bg-blue-950/50 border border-blue-500/30 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                      <Fingerprint className="w-5 h-5" />
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-white">Backoffice 2FA Challenge</p>
                      <p className="text-[11px] text-slate-400">
                        Enter the 6-digit verification PIN to authorize this session.
                      </p>
                    </div>
                  </div>

                  {/* 6 Digit PIN Inputs */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 text-center mb-2.5">
                      Security Code (6 Digits)
                    </label>
                    <div className="flex justify-center gap-2 sm:gap-2.5" onPaste={handlePinPaste}>
                      {twoFactorPin.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={pinRefs[idx]}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handlePinChange(idx, e.target.value)}
                          onKeyDown={(e) => handlePinKeyDown(idx, e)}
                          className="w-10 h-12 sm:w-12 sm:h-14 text-center font-mono font-bold text-lg bg-[#061120] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      type="submit"
                      disabled={loading || twoFactorPin.join("").length !== 6}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 animate-spin" />
                          Validating Token...
                        </span>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Authorize Backoffice Access</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-start text-xs pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setStep("CREDENTIALS");
                          setErrorMessage("");
                        }}
                        className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 text-[11px]"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Back to credentials
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* POWERED BY AVRO BY TECHNEXT Brand Signature */}
              <div className="pt-2 text-center border-t border-slate-800/80">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-700/60 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <span>POWERED BY AVRO BY TECHNEXT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-3.5 px-6 text-center text-slate-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 z-10 bg-[#060D1A]/90">
        <span className="font-semibold text-slate-400">
          POWERED BY AVRO BY TECHNEXT • SECURED MERCHANT BACKOFFICE
        </span>
        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span>Single-Store Dedicated Node</span>
          <span>•</span>
          <Link href="/" className="hover:text-slate-300">
            Storefront
          </Link>
        </div>
      </footer>
    </div>
  );
}

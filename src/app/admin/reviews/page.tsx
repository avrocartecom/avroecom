"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  ShieldCheck,
  Filter,
  MessageSquare,
  ThumbsUp,
  ExternalLink,
  Loader2,
  RefreshCw,
  Sparkles,
  Lock,
} from "lucide-react";
import { LockedFeatureBanner } from "@/components/admin/LockedFeatureBanner";
import { UpgradePlanModal } from "@/components/admin/UpgradePlanModal";
import { PlanTier } from "@/lib/license-core";

interface AdminReview {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  product: {
    id: string;
    title: string;
    slug: string;
    images?: { url: string }[];
  };
}

interface Metrics {
  totalReviews: number;
  approvedReviews: number;
  pendingReviews: number;
  averageRating: number;
  fiveStarCount: number;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalReviews: 0,
    approvedReviews: 0,
    pendingReviews: 0,
    averageRating: 5.0,
    fiveStarCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Plan & Subscription Permissions
  const [permissions, setPermissions] = useState<{
    plan: PlanTier;
    featureMatrix: Record<string, { allowed: boolean }>;
  } | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      fetch("/api/admin/permissions")
        .then((res) => res.json())
        .then((perm) => {
          if (perm && perm.plan) setPermissions(perm);
        })
        .catch(() => {});

      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (ratingFilter !== "ALL") params.set("rating", ratingFilter);
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/reviews?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setReviews(data.reviews || []);
        if (data.metrics) setMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [ratingFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReviews();
  };

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    if (permissions && permissions.featureMatrix.productReviews?.allowed === false) {
      setUpgradeModalOpen(true);
      return;
    }

    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });
      const data = await res.json();

      if (data.success) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isApproved: !currentStatus } : r))
        );
        setMetrics((prev) => ({
          ...prev,
          approvedReviews: !currentStatus ? prev.approvedReviews + 1 : prev.approvedReviews - 1,
          pendingReviews: !currentStatus ? prev.pendingReviews - 1 : prev.pendingReviews + 1,
        }));
        setNotification({
          type: "success",
          text: `Review ${!currentStatus ? "approved and made visible" : "hidden from storefront"}.`,
        });
      } else {
        setNotification({ type: "error", text: data.error || "Failed to update review status." });
      }
    } catch (err) {
      setNotification({ type: "error", text: "Network error updating review." });
    } finally {
      setUpdatingId(null);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (permissions && permissions.featureMatrix.productReviews?.allowed === false) {
      setUpgradeModalOpen(true);
      return;
    }

    if (!confirm("Are you sure you want to permanently delete this customer review?")) {
      return;
    }

    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        setMetrics((prev) => ({
          ...prev,
          totalReviews: Math.max(0, prev.totalReviews - 1),
        }));
        setNotification({ type: "success", text: "Review permanently deleted." });
      } else {
        setNotification({ type: "error", text: data.error || "Failed to delete review." });
      }
    } catch (err) {
      setNotification({ type: "error", text: "Network error deleting review." });
    } finally {
      setUpdatingId(null);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-blue-50 text-blue-600">
              <Star className="w-4 h-4 fill-blue-600" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Merchant Catalog
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Product Reviews & Moderation
          </h1>
          <p className="text-xs text-slate-400">
            Inspect, approve, and moderate verified buyer ratings across all catalog products.
          </p>
        </div>

        <button
          onClick={fetchReviews}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition border border-slate-700 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Locked Feature Notice for Basic Customers */}
      {permissions && permissions.featureMatrix.productReviews?.allowed === false && (
        <LockedFeatureBanner
          feature="productReviews"
          currentPlan={permissions.plan}
          onUpgradeSuccess={fetchReviews}
        />
      )}

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 shadow-md ${
            notification.type === "success"
              ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-200"
              : "bg-rose-950/70 border-rose-500/40 text-rose-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0B1A30] border border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Total Reviews
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {metrics.totalReviews}
            </span>
            <span className="text-xs text-slate-400 font-medium">all-time</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1A30] border border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Average Rating
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">
              {metrics.averageRating}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1A30] border border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Approved & Live
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">
              {metrics.approvedReviews}
            </span>
            <span className="text-xs text-slate-400 font-medium">published</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1A30] border border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            5-Star Ratings
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-blue-400">
              {metrics.fiveStarCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              ({metrics.totalReviews > 0 ? Math.round((metrics.fiveStarCount / metrics.totalReviews) * 100) : 100}%)
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0B1A30] border border-slate-800 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, comment keywords, or product title..."
              className="w-full bg-[#061120] border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Star Filter */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="bg-[#061120] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Stars</option>
              <option value="5">5 Stars Only</option>
              <option value="4">4 Stars Only</option>
              <option value="3">3 Stars Only</option>
              <option value="2">2 Stars Only</option>
              <option value="1">1 Star Only</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#061120] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="APPROVED">Approved Only</option>
              <option value="PENDING">Hidden Only</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Reviews Table / Cards */}
      <div className="rounded-2xl bg-[#0B1A30] border border-slate-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-xs">Loading customer reviews...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-16 text-center text-slate-400 space-y-2">
            <MessageSquare className="w-10 h-10 mx-auto text-slate-600" />
            <h3 className="text-sm font-bold text-slate-300">No customer reviews found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {search || ratingFilter !== "ALL" || statusFilter !== "ALL"
                ? "Try clearing your search query or changing filter parameters."
                : "When customers submit product reviews on your store, they will appear here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {reviews.map((rev) => {
              const prodImg = rev.product?.images?.[0]?.url || "/avro-logo.png";
              const isUpdating = updatingId === rev.id;

              return (
                <div key={rev.id} className="p-5 sm:p-6 hover:bg-[#0E203C]/50 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Product & Author Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <img
                          src={prodImg}
                          alt={rev.product?.title || "Product"}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/product/${rev.product?.slug}`}
                            target="_blank"
                            className="font-bold text-xs sm:text-sm text-white hover:text-blue-400 transition flex items-center gap-1"
                          >
                            <span>{rev.product?.title}</span>
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                          </Link>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="font-semibold text-slate-300">{rev.authorName}</span>
                          <span>•</span>
                          <span>
                            {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rating Stars & Status Badge */}
                    <div className="flex items-center gap-3 self-start sm:self-auto">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"
                            }`}
                          />
                        ))}
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          rev.isApproved
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {rev.isApproved ? "Approved" : "Hidden"}
                      </span>
                    </div>
                  </div>

                  {/* Review Comment */}
                  <div className="p-3.5 rounded-xl bg-[#061120] border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <p className="whitespace-pre-line">{rev.comment}</p>
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleToggleApproval(rev.id, rev.isApproved)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                        rev.isApproved
                          ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                      }`}
                    >
                      {rev.isApproved ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                          <span>Hide from Storefront</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Approve & Publish</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleDelete(rev.id)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 transition cursor-pointer disabled:opacity-50"
                      title="Permanently delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Plan Upgrade Modal */}
      <UpgradePlanModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlan={permissions?.plan || "BASIC"}
        recommendedTarget="GROW"
        onSuccess={() => {
          fetchReviews();
        }}
      />
    </div>
  );
}

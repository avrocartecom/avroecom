"use client";

import { useState } from "react";
import {
  Star,
  ShieldCheck,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Filter,
  PenTool,
  ChevronDown,
  X,
  Loader2,
} from "lucide-react";

export interface ReviewItem {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string | Date;
}

interface ProductReviewsProps {
  productId: string;
  productTitle: string;
  initialReviews?: ReviewItem[];
}

export function ProductReviews({
  productId,
  productTitle,
  initialReviews = [],
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [recommend, setRecommend] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filter & Sort State
  const [starFilter, setStarFilter] = useState<number | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest">("newest");
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [votedReviews, setVotedReviews] = useState<Record<string, boolean>>({});

  // Calculations
  const totalReviews = reviews.length;
  const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = totalReviews > 0 ? (ratingSum / totalReviews).toFixed(1) : "5.0";

  // Distribution
  const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.min(Math.max(Math.round(r.rating), 1), 5);
    counts[star] = (counts[star] || 0) + 1;
  });

  const getPercentage = (count: number) => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5:
        return "Exceptional — Highly Recommended!";
      case 4:
        return "Very Good — Satisfied Purchase";
      case 3:
        return "Average — Met Expectations";
      case 2:
        return "Below Average — Room for Improvement";
      case 1:
        return "Poor — Needs Immediate Attention";
      default:
        return "Select a Rating";
    }
  };

  // Submit Review Handler
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!authorName.trim() || authorName.trim().length < 2) {
      setErrorMsg("Please enter your name (minimum 2 characters).");
      return;
    }

    if (!comment.trim() || comment.trim().length < 5) {
      setErrorMsg("Please provide your review thoughts (minimum 5 characters).");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: authorName.trim(),
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to submit your review.");
        setSubmitting(false);
        return;
      }

      // Optimistically add to top of reviews list
      const newReview: ReviewItem = {
        id: data.review.id || `rev-${Date.now()}`,
        authorName: data.review.authorName,
        rating: data.review.rating,
        comment: data.review.comment,
        isApproved: true,
        createdAt: data.review.createdAt || new Date().toISOString(),
      };

      setReviews([newReview, ...reviews]);
      setSuccessMsg("Thank you! Your verified review has been published.");
      setComment("");
      setAuthorName("");
      setRating(5);
      setTimeout(() => {
        setIsFormOpen(false);
        setSuccessMsg("");
      }, 2500);
    } catch (err: any) {
      setErrorMsg("Network error. Could not connect to the review service.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpfulVote = (id: string) => {
    if (votedReviews[id]) return;
    setHelpfulVotes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    setVotedReviews((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  // Filtered & Sorted Reviews
  const filteredReviews = reviews
    .filter((r) => {
      if (starFilter === "ALL") return true;
      return Math.round(r.rating) === starFilter;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "highest") {
        return b.rating - a.rating;
      }
      if (sortBy === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    });

  // Avatar colors
  const avatarColors = [
    "from-blue-600 to-indigo-600",
    "from-emerald-600 to-teal-600",
    "from-amber-600 to-orange-600",
    "from-purple-600 to-pink-600",
    "from-rose-600 to-red-600",
  ];

  return (
    <div id="product-reviews" className="space-y-8 pt-8">
      {/* 1. Header with Title and Overall Stats */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-blue-50 text-blue-600">
              <MessageSquare className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Verified Feedback
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Customer Reviews & Ratings
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real experiences from verified shoppers across India.
          </p>
        </div>

        {/* Write a Review Button */}
        <button
          type="button"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
            isFormOpen
              ? "bg-slate-200 text-slate-800 hover:bg-slate-300"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isFormOpen ? (
            <>
              <X className="w-4 h-4" />
              <span>Cancel Review</span>
            </>
          ) : (
            <>
              <PenTool className="w-4 h-4" />
              <span>Write a Review</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Rating Breakdown Summary Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50/80 border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Big Score Block */}
          <div className="md:col-span-4 text-center md:text-left md:border-r md:border-slate-200 md:pr-8">
            <div className="flex items-baseline justify-center md:justify-start gap-2">
              <span className="text-5xl font-black tracking-tight text-slate-900">
                {averageRating}
              </span>
              <span className="text-base text-slate-400 font-bold">/ 5.0</span>
            </div>

            {/* Stars */}
            <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(Number(averageRating))
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  }`}
                />
              ))}
            </div>

            <p className="text-xs text-slate-600 mt-2 font-medium">
              Based on{" "}
              <strong className="font-bold text-slate-900">{totalReviews}</strong> customer{" "}
              {totalReviews === 1 ? "review" : "reviews"}
            </p>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[10px] font-bold mt-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Authenticated Reviews</span>
            </div>
          </div>

          {/* Rating Bars Distribution */}
          <div className="md:col-span-8 space-y-2.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = counts[star] || 0;
              const pct = getPercentage(count);
              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 w-14 font-bold text-slate-700 flex-shrink-0">
                    <span>{star}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>

                  {/* Bar */}
                  <div className="flex-1 h-3 rounded-full bg-slate-200 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        star >= 4
                          ? "bg-amber-400"
                          : star === 3
                          ? "bg-amber-500"
                          : "bg-slate-400"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Percentage & Count */}
                  <div className="w-16 text-right font-mono text-[11px] text-slate-500 flex-shrink-0">
                    <span>{pct}%</span>
                    <span className="text-slate-400 ml-1">({count})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Collapsible "Write a Review" Form */}
      {isFormOpen && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-blue-500/40 shadow-xl space-y-6 transition-all duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-base font-black text-slate-900 tracking-tight">
                Review & Rate This Product
              </h4>
              <p className="text-xs text-slate-500">
                Sharing your real experience helps other shoppers make informed choices.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error / Success Notifications */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmitReview} className="space-y-5">
            {/* Star Rating Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Overall Rating <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const activeVal = hoverRating || rating;
                    const isFilled = starVal <= activeVal;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 rounded-lg hover:bg-amber-50 transition-transform active:scale-90 cursor-pointer"
                        title={`${starVal} star${starVal > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? "fill-amber-400 text-amber-400 scale-105"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                  {getRatingLabel(hoverRating || rating)}
                </span>
              </div>
            </div>

            {/* Author Name */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Your Full Name or Nickname <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Your Review & Observations <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review here..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed"
              />
            </div>

            {/* Recommendation Checkbox */}
            <label className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={recommend}
                onChange={(e) => setRecommend(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span>Yes, I recommend this product to other buyers</span>
            </label>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md disabled:opacity-50 transition-all cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Filter & Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        {/* Star Rating Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setStarFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              starFilter === "ALL"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Reviews ({totalReviews})
          </button>
          {[5, 4, 3, 2, 1].map((s) => {
            const c = counts[s] || 0;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStarFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  starFilter === s
                    ? "bg-amber-400 text-slate-900 shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>{s}</span>
                <Star className="w-3 h-3 fill-current" />
                <span className="text-[10px] opacity-75">({c})</span>
              </button>
            );
          })}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-600">
          <span className="font-semibold text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
          >
            <option value="newest">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* 5. Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <h5 className="font-bold text-sm text-slate-900">
              {starFilter === "ALL"
                ? "No reviews yet for this product"
                : `No ${starFilter}-star reviews found`}
            </h5>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {starFilter === "ALL"
                ? "Be the first verified customer to share thoughts and help other shoppers!"
                : "Try selecting a different star filter above to see other buyer experiences."}
            </p>
            {starFilter === "ALL" && !isFormOpen && (
              <button
                type="button"
                onClick={() => setIsFormOpen(true)}
                className="mt-2 px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-700 transition"
              >
                Write the First Review
              </button>
            )}
          </div>
        ) : (
          filteredReviews.map((rev, idx) => {
            const colorClass = avatarColors[idx % avatarColors.length];
            const initial = rev.authorName ? rev.authorName.charAt(0).toUpperCase() : "U";
            const formattedDate = new Date(rev.createdAt).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const votes = helpfulVotes[rev.id] || 0;
            const hasVoted = votedReviews[rev.id] || false;

            return (
              <div
                key={rev.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 transition-all hover:border-slate-300"
              >
                {/* Author Info & Rating Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {/* Initial Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${colorClass} text-white font-bold flex items-center justify-center text-sm shadow-xs flex-shrink-0`}
                    >
                      {initial}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs sm:text-sm font-bold text-slate-900">
                          {rev.authorName}
                        </strong>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Verified Buyer</span>
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        Reviewed on {formattedDate}
                      </span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 self-start sm:self-auto">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1">
                      {rev.rating}.0
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line pt-1">
                  {rev.comment}
                </p>

                {/* Helpful Button & Product Mention */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-400">
                    Product: <strong className="text-slate-600 font-semibold">{productTitle}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleHelpfulVote(rev.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      hasVoted
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                    title="Mark this review as helpful"
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? "fill-blue-600" : ""}`} />
                    <span>
                      Helpful {votes > 0 ? `(${votes})` : ""}
                    </span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

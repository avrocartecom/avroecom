"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Globe,
  Sparkles,
  Info,
  ShieldCheck,
  Search,
  Eye,
  Check,
  AlertCircle,
} from "lucide-react";

interface PageItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  status: "PUBLISHED" | "DRAFT";
  showInFooter?: boolean;
  showInNav?: boolean;
  isSystem?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminPagesManager() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal state
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form inputs
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formMetaTitle, setFormMetaTitle] = useState("");
  const [formMetaDescription, setFormMetaDescription] = useState("");
  const [formStatus, setFormStatus] = useState<"PUBLISHED" | "DRAFT">("PUBLISHED");
  const [formShowInFooter, setFormShowInFooter] = useState(true);
  const [formShowInNav, setFormShowInNav] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const loadPages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      if (data.success) {
        setPages(data.pages);
      }
    } catch (err: any) {
      console.error("Failed to load pages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenCreateModal = () => {
    setIsCreatingNew(true);
    setEditingPage(null);
    setFormTitle("");
    setFormSlug("");
    setFormContent("");
    setFormMetaTitle("");
    setFormMetaDescription("");
    setFormStatus("PUBLISHED");
    setFormShowInFooter(true);
    setFormShowInNav(false);
    setActiveTab("edit");
  };

  const handleOpenEditModal = (page: PageItem) => {
    setIsCreatingNew(false);
    setEditingPage(page);
    setFormTitle(page.title);
    setFormSlug(page.slug);
    setFormContent(page.content);
    setFormMetaTitle(page.metaTitle || page.title);
    setFormMetaDescription(page.metaDescription || "");
    setFormStatus(page.status || "PUBLISHED");
    setFormShowInFooter(page.showInFooter ?? true);
    setFormShowInNav(page.showInNav ?? false);
    setActiveTab("edit");
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (isCreatingNew) {
      // Auto-generate slug from title
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setFormSlug(generatedSlug);
    }
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSlug.trim() || !formContent.trim()) {
      showToast("Title, URL slug, and content are required.", "error");
      return;
    }

    setSaving(true);
    try {
      const endpoint = "/api/admin/pages";
      const method = isCreatingNew ? "POST" : "PUT";
      const payload = {
        id: editingPage?.id,
        title: formTitle,
        slug: formSlug,
        content: formContent,
        metaTitle: formMetaTitle,
        metaDescription: formMetaDescription,
        status: formStatus,
        showInFooter: formShowInFooter,
        showInNav: formShowInNav,
      };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(isCreatingNew ? "Page published successfully!" : "Page updated successfully!");
        setEditingPage(null);
        setIsCreatingNew(false);
        loadPages();
      } else {
        showToast(data.error || "Failed to save page", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Network error", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePage = async (page: PageItem) => {
    if (page.isSystem) {
      showToast("Standard system pages cannot be deleted.", "error");
      return;
    }

    if (!confirm(`Are you sure you want to delete "${page.title}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(page.id);
    try {
      const res = await fetch(`/api/admin/pages?id=${page.id}&slug=${page.slug}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("Page deleted successfully.");
        loadPages();
      } else {
        showToast(data.error || "Failed to delete page", "error");
      }
    } catch (err: any) {
      showToast("Failed to delete page", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const systemPages = useMemo(() => {
    return pages.filter((p) => p.isSystem || ["about", "shipping-policy", "return-policy", "terms", "privacy-policy"].includes(p.slug));
  }, [pages]);

  const customPages = useMemo(() => {
    return pages.filter((p) => !p.isSystem && !["about", "shipping-policy", "return-policy", "terms", "privacy-policy"].includes(p.slug));
  }, [pages]);

  const filteredCustomPages = useMemo(() => {
    if (!searchQuery.trim()) return customPages;
    const q = searchQuery.toLowerCase();
    return customPages.filter(
      (p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
    );
  }, [customPages, searchQuery]);

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight">
              Pages & Store Content
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#2563EB] border border-blue-200">
              {pages.length} Pages
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Customize standard policy pages (About Us, Shipping, Returns, Privacy, Terms) and publish new custom pages for your storefront.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Custom Page
        </button>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs transition-all ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100 ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Section 1: Standard Brand & Policy Pages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-[#0A192F] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              Standard Brand & Policy Pages
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Core trust & legal documentation displayed in your storefront header and footer.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemPages.map((page) => {
            const pageUrl = page.slug === "about" ? "/about" : `/${page.slug}`;

            return (
              <div
                key={page.slug}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase bg-blue-50 text-[#2563EB] border border-blue-200">
                      Standard Page
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Live
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-[#0A192F]">{page.title}</h3>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mt-1">
                      <Globe className="w-3 h-3 text-slate-400" />
                      <span>{pageUrl}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {page.content.replace(/###/g, "").slice(0, 140)}...
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={pageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Live
                  </a>

                  <button
                    onClick={() => handleOpenEditModal(page)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#0A192F] hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit Content
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Custom Store Pages */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-extrabold text-[#0A192F] uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2563EB]" />
              Custom Store Pages
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Additional merchant pages (e.g., FAQ, Size Guides, Warranty, Brand Story, Wholesale).
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search custom pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading pages...</div>
          ) : filteredCustomPages.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 mx-auto flex items-center justify-center">
                <FileText className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Custom Pages Created Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create dedicated information pages such as "FAQ", "Sizing Guide", "Track Order Instructions", or "Corporate Inquiries".
              </p>
              <button
                onClick={handleOpenCreateModal}
                className="mt-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl transition-all shadow-sm inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Your First Page
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50/75 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <div className="col-span-5">Page Title & Slug</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Footer Link</div>
                <div className="col-span-3 text-right">Actions</div>
              </div>

              {filteredCustomPages.map((page) => {
                const liveUrl = `/pages/${page.slug}`;

                return (
                  <div
                    key={page.id}
                    className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-slate-50/50 transition-colors text-xs"
                  >
                    <div className="col-span-5 space-y-1">
                      <strong className="text-slate-900 font-bold block">{page.title}</strong>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                        <Globe className="w-3 h-3 text-slate-400" />
                        <span>{liveUrl}</span>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                          page.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            page.status === "PUBLISHED" ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        {page.status}
                      </span>
                    </div>

                    <div className="col-span-2 text-slate-600 font-medium">
                      {page.showInFooter ? (
                        <span className="text-emerald-600 flex items-center gap-1 text-[11px] font-semibold">
                          <Check className="w-3.5 h-3.5" /> Visible
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Hidden</span>
                      )}
                    </div>

                    <div className="col-span-3 flex items-center justify-end gap-2">
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="View Live Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => handleOpenEditModal(page)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#0A192F] hover:text-white text-slate-700 font-bold transition-all flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeletePage(page)}
                        disabled={deletingId === page.id}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        title="Delete Page"
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
      </div>

      {/* Page Edit / Create Modal Drawer */}
      {(editingPage || isCreatingNew) && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/75">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0A192F]">
                    {isCreatingNew
                      ? "Create New Store Page"
                      : `Edit Page: ${editingPage?.title}`}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {editingPage?.isSystem
                      ? "Standard policy page — URL route is fixed to protect store links"
                      : "Custom page rendered at /pages/[slug] on your public storefront"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditingPage(null);
                  setIsCreatingNew(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePage} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Page Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Sizing & Fit Guide"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    URL Slug <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-xs font-mono text-slate-500">
                      {editingPage?.slug === "about"
                        ? "/about"
                        : editingPage?.isSystem
                        ? "/"
                        : "/pages/"}
                    </span>
                    <input
                      type="text"
                      required
                      disabled={Boolean(editingPage?.isSystem)}
                      value={formSlug}
                      onChange={(e) =>
                        setFormSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9_-]/g, "-")
                        )
                      }
                      placeholder="size-guide"
                      className={`w-full px-3 py-2.5 border border-slate-200 rounded-r-xl text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]/20 ${
                        editingPage?.isSystem
                          ? "bg-slate-100 text-slate-500 cursor-not-allowed"
                          : "bg-white"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Status and Visibility Settings */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Publish Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold focus:outline-hidden"
                  >
                    <option value="PUBLISHED">Published (Public)</option>
                    <option value="DRAFT">Draft (Hidden)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5 sm:pt-6">
                  <input
                    type="checkbox"
                    id="showFooterCheck"
                    checked={formShowInFooter}
                    onChange={(e) => setFormShowInFooter(e.target.checked)}
                    className="w-4 h-4 text-[#2563EB] rounded-sm border-slate-300 focus:ring-0"
                  />
                  <label htmlFor="showFooterCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Show link in storefront footer
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-5 sm:pt-6">
                  <input
                    type="checkbox"
                    id="showNavCheck"
                    checked={formShowInNav}
                    onChange={(e) => setFormShowInNav(e.target.checked)}
                    className="w-4 h-4 text-[#2563EB] rounded-sm border-slate-300 focus:ring-0"
                  />
                  <label htmlFor="showNavCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Show link in top navbar
                  </label>
                </div>
              </div>

              {/* Content Editor with Preview Switcher */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Page Content <span className="text-rose-500">*</span>
                  </label>

                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setActiveTab("edit")}
                      className={`px-3 py-1 rounded-md transition-all ${
                        activeTab === "edit"
                          ? "bg-white text-slate-900 shadow-2xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Write / Markdown
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("preview")}
                      className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                        activeTab === "preview"
                          ? "bg-white text-slate-900 shadow-2xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      Live Preview
                    </button>
                  </div>
                </div>

                {activeTab === "edit" ? (
                  <div className="space-y-1">
                    <textarea
                      required
                      rows={12}
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      placeholder="Write your page content here... Supports standard paragraphs and markdown headings (### Heading)."
                      className="w-full p-4 border border-slate-200 rounded-2xl text-xs font-sans leading-relaxed bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]/20 resize-y"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Tip: Use `### Section Title` for headings, and blank lines to separate paragraphs.</span>
                      <span>{formContent.length} characters</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border border-slate-200 rounded-2xl bg-slate-50/50 min-h-[250px] max-h-[350px] overflow-y-auto prose prose-slate text-xs text-slate-700 space-y-3 leading-relaxed">
                    {formContent ? (
                      formContent.split("\n\n").map((block, idx) => {
                        if (block.startsWith("### ")) {
                          return (
                            <h4 key={idx} className="text-sm font-bold text-slate-900 pt-2">
                              {block.replace("### ", "")}
                            </h4>
                          );
                        }
                        if (block.startsWith("## ")) {
                          return (
                            <h3 key={idx} className="text-base font-extrabold text-slate-900 pt-3">
                              {block.replace("## ", "")}
                            </h3>
                          );
                        }
                        return <p key={idx}>{block}</p>;
                      })
                    ) : (
                      <p className="text-slate-400 italic">No content typed yet.</p>
                    )}
                  </div>
                )}
              </div>

              {/* SEO Meta Tags Accordion */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Search Engine Optimization (SEO)
                </span>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      SEO Meta Title (Browser & Search)
                    </label>
                    <input
                      type="text"
                      value={formMetaTitle}
                      onChange={(e) => setFormMetaTitle(e.target.value)}
                      placeholder={formTitle || "Page Title — Brand Name"}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-slate-600">
                        SEO Meta Description
                      </label>
                      <span className="text-[10px] text-slate-400">
                        {formMetaDescription.length} / 160 recommended
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={formMetaDescription}
                      onChange={(e) => setFormMetaDescription(e.target.value)}
                      placeholder="Brief summary of this page for Google search results..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPage(null);
                    setIsCreatingNew(false);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {saving ? "Saving Changes..." : isCreatingNew ? "Publish Page" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

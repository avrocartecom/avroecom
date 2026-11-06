"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FolderTree,
  Plus,
  Search,
  Filter,
  Layers,
  Sparkles,
  Edit,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  X,
  Sliders,
} from "lucide-react";

interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: "MANUAL" | "AUTOMATED";
  rule?: string;
  productCount: number;
  imageUrl: string;
  status: "ACTIVE" | "HIDDEN";
}

const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: "col_01",
    title: "Best Sellers & Customer Favorites",
    slug: "best-sellers",
    description: "Our highest rated and top-performing products across all categories.",
    type: "AUTOMATED",
    rule: "Total sales > 50 units",
    productCount: 14,
    imageUrl: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600&auto=format&fit=crop",
    status: "ACTIVE",
  },
  {
    id: "col_02",
    title: "Minimalist Workstation Essentials",
    slug: "workstation",
    description: "Curated desk accessories, ergonomic stands, and premium cable management.",
    type: "MANUAL",
    rule: "Hand-picked catalog items",
    productCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=600&auto=format&fit=crop",
    status: "ACTIVE",
  },
  {
    id: "col_03",
    title: "New Arrivals · Winter 2026",
    slug: "winter-2026",
    description: "Seasonal apparel, performance outerwear, and thermal layering pieces.",
    type: "AUTOMATED",
    rule: "Tag contains 'winter' AND stock > 0",
    productCount: 19,
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
    status: "ACTIVE",
  },
];

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>(INITIAL_COLLECTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"MANUAL" | "AUTOMATED">("AUTOMATED");
  const [ruleCondition, setRuleCondition] = useState("tag_equals");
  const [ruleValue, setRuleValue] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const newCol: Collection = {
      id: `col_${Date.now()}`,
      title,
      slug,
      description,
      type,
      rule: type === "AUTOMATED" ? `${ruleCondition} '${ruleValue || "featured"}'` : "Hand-selected products",
      productCount: Math.floor(Math.random() * 10) + 1,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop",
      status: "ACTIVE",
    };

    setCollections([newCol, ...collections]);
    setIsModalOpen(false);
    setTitle("");
    setDescription("");
    setRuleValue("");
    setImageUrl("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this collection?")) {
      setCollections(collections.filter((c) => c.id !== id));
    }
  };

  const filtered = collections.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/products" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
              Products
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-700">Collections</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <FolderTree className="w-6 h-6 text-purple-600" />
            Product Collections
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Group products by hand or by automated rules (price, tags, inventory) to feature on your storefront.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Collection
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            <div>
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                <img
                  src={c.imageUrl}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span
                  className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    c.type === "AUTOMATED"
                      ? "bg-purple-900/90 text-purple-200 backdrop-blur-xs"
                      : "bg-blue-900/90 text-blue-200 backdrop-blur-xs"
                  }`}
                >
                  {c.type === "AUTOMATED" ? "Automated Rule" : "Manual Selection"}
                </span>
                <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold">
                  {c.productCount} Products
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">{c.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{c.description}</p>
                {c.rule && (
                  <div className="pt-2">
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100 block truncate">
                      ⚙️ {c.rule}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/50">
              <Link
                href={`/shop?collection=${c.slug}`}
                target="_blank"
                className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
              >
                View on Store <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                onClick={() => handleDelete(c.id)}
                className="text-rose-500 hover:text-rose-700 p-1"
                title="Delete collection"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE COLLECTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-purple-600" />
                Create New Collection
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Collection Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Collection title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description / SEO Summary</label>
                <textarea
                  rows={2}
                  placeholder="Tell customers what is inside this collection..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Collection Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between ${
                      type === "MANUAL" ? "border-blue-600 bg-blue-50/50" : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="colType"
                        checked={type === "MANUAL"}
                        onChange={() => setType("MANUAL")}
                      />
                      <span className="font-bold text-slate-800">Manual</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">Add items one by one</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between ${
                      type === "AUTOMATED" ? "border-blue-600 bg-blue-50/50" : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="colType"
                        checked={type === "AUTOMATED"}
                        onChange={() => setType("AUTOMATED")}
                      />
                      <span className="font-bold text-slate-800">Automated</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">Group products by rules</span>
                  </label>
                </div>
              </div>

              {type === "AUTOMATED" && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 block text-[11px]">Automation Condition</span>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={ruleCondition}
                      onChange={(e) => setRuleCondition(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="tag_equals">Product Tag Equals</option>
                      <option value="price_greater_than">Price Greater Than</option>
                      <option value="inventory_stock">Stock Quantity &gt; 0</option>
                      <option value="category_is">Category Match</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Filter rule value"
                      value={ruleValue}
                      onChange={(e) => setRuleValue(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-bold mb-1">Banner Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

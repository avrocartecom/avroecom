"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Clock,
  ArrowRight,
  ExternalLink,
  X,
  CheckCircle2,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  status: "PUBLISHED" | "DRAFT";
  coverImageUrl: string;
  readTime: string;
}

const SAMPLE_POSTS: BlogPost[] = [
  {
    id: "post_01",
    title: "The Architecture of High-Performance Athletic Gear: Materials That Last",
    slug: "high-performance-materials-guide",
    author: "Editorial Team",
    excerpt: "An engineering breakdown of moisture-wicking synthetic fibers vs merino wool in demanding training environments.",
    content: "Detailed editorial content exploring fabric technology...",
    publishedAt: "2026-11-04T09:00:00Z",
    status: "PUBLISHED",
    coverImageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    readTime: "4 min read",
  },
  {
    id: "post_02",
    title: "Desk Setup Ergonomics: Why Aluminium Monitor Arms Change Posture",
    slug: "desk-setup-ergonomics",
    author: "Karan Johal",
    excerpt: "How proper display elevation and mechanical articulation eliminate neck strain during 10-hour workdays.",
    content: "Comprehensive ergonomic research findings...",
    publishedAt: "2026-10-28T14:30:00Z",
    status: "PUBLISHED",
    coverImageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=600&auto=format&fit=crop",
    readTime: "5 min read",
  },
];

export default function BlogPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>(SAMPLE_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [author, setAuthor] = useState("Store Editor");
  const [coverImageUrl, setCoverImageUrl] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const newPost: BlogPost = {
      id: `post_${Date.now()}`,
      title,
      slug,
      author,
      excerpt,
      content: excerpt,
      publishedAt: new Date().toISOString(),
      status: "PUBLISHED",
      coverImageUrl: coverImageUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&auto=format&fit=crop",
      readTime: "3 min read",
    };

    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
    setTitle("");
    setExcerpt("");
    setCoverImageUrl("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this blog post?")) {
      setPosts(posts.filter((p) => p.id !== id));
    }
  };

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Content</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-700">Blog Posts</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-purple-600" />
            Blog Posts & Articles
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Publish educational articles, brand stories, and product guides to rank on Google and drive organic search traffic.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Write Blog Post
        </button>
      </div>

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            <div>
              <div className="aspect-[16/9] overflow-hidden bg-slate-100 relative">
                <img
                  src={p.coverImageUrl}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-xs text-white">
                  {p.readTime}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <User className="w-3.5 h-3.5" />
                  <span>{p.author}</span>
                  <span>•</span>
                  <span>
                    {new Date(p.publishedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 line-clamp-2">{p.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{p.excerpt}</p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/50">
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase border border-emerald-200">
                {p.status}
              </span>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-rose-500 hover:text-rose-700 p-1"
                title="Delete article"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* WRITE POST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Draft New Blog Article
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Article Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="Article headline"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Author Name</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Summary / Excerpt *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Write a captivating summary for search results and social previews..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
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
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

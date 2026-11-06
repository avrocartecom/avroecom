"use client";

import { useEffect, useState } from "react";
import { Archive, Plus, Trash2, FolderTree, Image as ImageIcon } from "lucide-react";

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newCat, setNewCat] = useState({
    name: "",
    slug: "",
    description: "",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
  });

  const loadCategories = () => {
    setLoading(true);
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.categories);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCat),
    });
    if (res.ok) {
      setIsAddModalOpen(false);
      setNewCat({ name: "", slug: "", description: "", image: "" });
      loadCategories();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete category?")) return;
    await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    loadCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0A192F]">Category Hierarchy</h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize catalog products into collections, banners, and storefront navigation menus.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-[#0A192F] hover:bg-[#1E293B] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-xs text-slate-400 py-8">Loading categories...</div>
        ) : (
          categories.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-32 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-100">
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <FolderTree className="w-8 h-8" />
                    </div>
                  )}
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#0A192F]/80 text-white backdrop-blur-sm">
                    {c._count?.products || 0} Products
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{c.name}</h3>
                  <code className="text-[10px] text-slate-400 block mt-0.5">/{c.slug}</code>
                  {c.description && <p className="text-xs text-slate-500 mt-2">{c.description}</p>}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#0A192F]">Add Store Category</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  placeholder="e.g. Footwear & Shoes"
                  className="w-full px-3 py-1.5 border rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={newCat.image}
                  onChange={(e) => setNewCat({ ...newCat, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 border rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newCat.description}
                  onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-lg focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 border rounded-lg text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0A192F] text-white font-bold rounded-lg"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

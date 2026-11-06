"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Plus,
  Trash2,
  Edit,
  ArrowRight,
  ExternalLink,
  GripVertical,
  CheckCircle2,
  X,
  FileText,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  url: string;
}

interface MenuSection {
  id: string;
  name: string;
  handle: string;
  items: MenuItem[];
}

const INITIAL_MENUS: MenuSection[] = [
  {
    id: "menu_main",
    name: "Main Header Navigation",
    handle: "main-menu",
    items: [
      { id: "m1", label: "Home", url: "/" },
      { id: "m2", label: "Shop Catalog", url: "/shop" },
      { id: "m3", label: "Featured Collections", url: "/shop#categories" },
      { id: "m4", label: "Brand Heritage", url: "/about" },
    ],
  },
  {
    id: "menu_footer",
    name: "Footer Navigation Links",
    handle: "footer-menu",
    items: [
      { id: "f1", label: "About Us", url: "/about" },
      { id: "f2", label: "Track Active Order", url: "/track" },
      { id: "f3", label: "Shipping Policy", url: "/shipping-policy" },
      { id: "f4", label: "Returns & Exchanges", url: "/return-policy" },
      { id: "f5", label: "Privacy Policy", url: "/privacy-policy" },
      { id: "f6", label: "Terms of Service", url: "/terms" },
    ],
  },
];

export default function NavigationMenusPage() {
  const [menus, setMenus] = useState<MenuSection[]>(INITIAL_MENUS);
  const [selectedMenu, setSelectedMenu] = useState<MenuSection>(menus[0]);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newUrl) return;

    const newItem: MenuItem = {
      id: `item_${Date.now()}`,
      label: newLabel,
      url: newUrl,
    };

    const updatedMenu = {
      ...selectedMenu,
      items: [...selectedMenu.items, newItem],
    };

    setMenus(menus.map((m) => (m.id === selectedMenu.id ? updatedMenu : m)));
    setSelectedMenu(updatedMenu);
    setIsAddItemOpen(false);
    setNewLabel("");
    setNewUrl("");
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedMenu = {
      ...selectedMenu,
      items: selectedMenu.items.filter((it) => it.id !== itemId),
    };
    setMenus(menus.map((m) => (m.id === selectedMenu.id ? updatedMenu : m)));
    setSelectedMenu(updatedMenu);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Content</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-700">Navigation Menus</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <Menu className="w-6 h-6 text-blue-600" />
            Navigation Menus & Links
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your store header navigation bar, nested sub-menus, and footer policy links.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Menu Switcher */}
        <div className="md:col-span-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-2 pb-1">
            Store Navigation Menus
          </span>
          {menus.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMenu(m)}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${
                selectedMenu.id === m.id
                  ? "bg-[#0A192F] text-white font-bold shadow-xs"
                  : "text-slate-700 hover:bg-slate-50 font-semibold"
              }`}
            >
              <div className="flex items-center gap-2 text-xs">
                <Menu className="w-4 h-4 opacity-70" />
                <span>{m.name}</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  selectedMenu.id === m.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {m.items.length} links
              </span>
            </button>
          ))}
        </div>

        {/* Right: Items Editor */}
        <div className="md:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">{selectedMenu.name}</h2>
              <span className="text-[11px] font-mono text-slate-400">handle: {selectedMenu.handle}</span>
            </div>
            <button
              onClick={() => setIsAddItemOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Menu Link
            </button>
          </div>

          {/* Links List */}
          <div className="space-y-2">
            {selectedMenu.items.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-300 font-mono text-[11px] w-4">{idx + 1}</span>
                  <div>
                    <span className="font-bold text-slate-900 block">{item.label}</span>
                    <span className="text-[11px] text-blue-600 font-mono">{item.url}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5"
                  title="Remove link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADD ITEM MODAL */}
      {isAddItemOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Add Menu Link
              </h2>
              <button onClick={() => setIsAddItemOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Display Label *</label>
                <input
                  type="text"
                  required
                  placeholder="Menu item label"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Destination URL / Path *</label>
                <input
                  type="text"
                  required
                  placeholder="/shop, /about, or URL"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddItemOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Add Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

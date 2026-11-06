"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Database,
  Plus,
  Search,
  Code2,
  Table,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  ChevronRight,
  FileCode,
} from "lucide-react";

interface MetaobjectDefinition {
  id: string;
  name: string;
  type: string;
  description: string;
  fieldCount: number;
  entryCount: number;
  fields: { name: string; key: string; type: string }[];
}

export default function MetaobjectsAdminPage() {
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [definitions, setDefinitions] = useState<MetaobjectDefinition[]>([
    {
      id: "mo-1",
      name: "Size Guide Matrix",
      type: "size_guide",
      description: "Apparel measurement chart and fit recommendations for product detail pages.",
      fieldCount: 5,
      entryCount: 14,
      fields: [
        { name: "Fit Category", key: "fit_category", type: "single_line_text" },
        { name: "Chest (inches)", key: "chest_inches", type: "number_decimal" },
        { name: "Length (cm)", key: "length_cm", type: "number_decimal" },
        { name: "Model Height", key: "model_height", type: "single_line_text" },
        { name: "Diagram Image", key: "diagram_image", type: "file_reference" },
      ],
    },
    {
      id: "mo-2",
      name: "Material & Fabric Highlights",
      type: "material_fabric",
      description: "Sustainable yarn certifications, GSM weight, and washing instructions.",
      fieldCount: 4,
      entryCount: 8,
      fields: [
        { name: "Material Name", key: "material_name", type: "single_line_text" },
        { name: "GSM Rating", key: "gsm_rating", type: "number_integer" },
        { name: "Care Guide", key: "care_guide", type: "rich_text" },
        { name: "Eco Badge", key: "eco_badge", type: "boolean" },
      ],
    },
    {
      id: "mo-3",
      name: "Store Staff & Creators",
      type: "staff_creator",
      description: "Author bios, photography credits, and styling notes shown on blog & PDP.",
      fieldCount: 4,
      entryCount: 6,
      fields: [
        { name: "Full Name", key: "full_name", type: "single_line_text" },
        { name: "Role Title", key: "role_title", type: "single_line_text" },
        { name: "Avatar Photo", key: "avatar_url", type: "file_reference" },
        { name: "Instagram Handle", key: "instagram", type: "single_line_text" },
      ],
    },
    {
      id: "mo-4",
      name: "Warranty & Certification",
      type: "warranty_cert",
      description: "BIS, Hallmark, and 1-Year manufacturer guarantee terms.",
      fieldCount: 3,
      entryCount: 12,
      fields: [
        { name: "Certificate ID", key: "cert_id", type: "single_line_text" },
        { name: "Valid Months", key: "valid_months", type: "number_integer" },
        { name: "PDF Proof", key: "pdf_file", type: "file_reference" },
      ],
    },
  ]);

  // Create form state
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newType.trim()) return;

    const newDef: MetaobjectDefinition = {
      id: `mo-${Date.now()}`,
      name: newName,
      type: newType.toLowerCase().replace(/[^a-z0-9_]/g, "_"),
      description: newDesc || "Custom structured data schema for storefront templates.",
      fieldCount: 2,
      entryCount: 0,
      fields: [
        { name: "Title", key: "title", type: "single_line_text" },
        { name: "Content Value", key: "content_value", type: "rich_text" },
      ],
    };

    setDefinitions([newDef, ...definitions]);
    setShowCreateModal(false);
    setNewName("");
    setNewType("");
    setNewDesc("");
    showToast(`Metaobject "${newDef.name}" created successfully.`);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete metaobject definition "${name}"? Existing entries will be unlinked.`)) return;
    setDefinitions(definitions.filter((d) => d.id !== id));
    showToast(`Definition "${name}" deleted.`);
  };

  const filtered = definitions.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.type.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A192F] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/admin/media" className="hover:text-blue-600">Content Library</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">Metaobjects</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Metaobjects & Structured Schemas
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Define custom multi-field models for size charts, material certifications, store locations, and PDP callouts.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Definition</span>
        </button>
      </div>

      {/* Quick search and stats */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search metaobject definitions or types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium self-center">
          Showing <strong className="text-slate-900">{filtered.length}</strong> schema definitions
        </div>
      </div>

      {/* Definitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((def) => (
          <div
            key={def.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{def.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                      type: {def.type}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-bold">
                      {def.entryCount} entries live
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(def.id, def.name)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Delete definition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {def.description}
            </p>

            {/* Field list preview */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1.5">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Schema Fields ({def.fields.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {def.fields.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-medium text-slate-700"
                  >
                    <span className="font-bold text-slate-900">{f.name}</span>
                    <span className="text-slate-400">({f.type})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400 text-[11px]">JSON Storefront API Ready</span>
              <button
                onClick={() => showToast(`Opening entry editor for ${def.name}...`)}
                className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
              >
                <span>View & Add Entries</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Callout */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 space-y-1">
          <p className="font-bold text-slate-900">How AVRO Metaobjects Work</p>
          <p className="text-slate-600 leading-relaxed">
            Metaobjects allow merchants to define relational structured content that can be referenced by Products, Collections, or Theme Sections. Once defined, you can query entries directly via Liquid templates or the Next.js Storefront GraphQL API.
          </p>
        </div>
      </div>

      {/* Create Definition Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5">
            <div>
              <h2 className="text-base font-black text-slate-900">Add Metaobject Definition</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Create a schema with fields for structured storefront content.
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Definition Name</label>
                <input
                  type="text"
                  required
                  placeholder="Definition name"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    if (!newType) {
                      setNewType(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "_"));
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Type Identifier (Key)</label>
                <input
                  type="text"
                  required
                  placeholder="type_identifier"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Where and how this structured data is displayed in your store..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0A192F] text-white font-bold hover:bg-[#1E293B]"
                >
                  Create Schema
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

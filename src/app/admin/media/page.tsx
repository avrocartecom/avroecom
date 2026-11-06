"use client";

import { useEffect, useState, useRef } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  Film,
  Search,
  Trash2,
  Copy,
  Check,
  Maximize2,
  X,
  RefreshCw,
  FolderOpen,
  FileCheck,
  Play,
  Pause,
  AlertCircle,
  HardDrive,
  Layers,
} from "lucide-react";

interface MediaAsset {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  altText?: string | null;
  createdAt: string;
}

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "image" | "video">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Media Assets
  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/media${filterType !== "all" ? `?type=${filterType}` : ""}`);
      const data = await res.json();
      if (data.success) {
        setAssets(data.assets || []);
      }
    } catch (err) {
      console.error("Error loading media assets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [filterType]);

  // Handle File Upload from System
  const handleUploadFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(`Uploading ${files.length} file(s) from system...`);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setUploadProgress("Upload complete!");
        setTimeout(() => setUploadProgress(""), 2000);
        fetchAssets();
      } else {
        alert(data.error || "Failed to upload files.");
      }
    } catch (err: any) {
      alert("Network error uploading files from system.");
    } finally {
      setUploading(false);
    }
  };

  // Drag and Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  // Copy Direct Link
  const handleCopyUrl = (asset: MediaAsset) => {
    const fullUrl = asset.fileUrl.startsWith("http")
      ? asset.fileUrl
      : `${window.location.origin}${asset.fileUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Delete Asset
  const handleDeleteAsset = async (asset: MediaAsset) => {
    if (!confirm(`Delete "${asset.fileName}" permanently?`)) return;

    try {
      const res = await fetch(`/api/admin/media?id=${asset.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setAssets((prev) => prev.filter((a) => a.id !== asset.id));
        if (previewAsset?.id === asset.id) setPreviewAsset(null);
      } else {
        alert(data.error || "Failed to delete file.");
      }
    } catch (err) {
      alert("Network error deleting asset.");
    }
  };

  // Format File Size
  const formatSize = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Compute Stats
  const imageCount = assets.filter((a) => a.fileType === "image").length;
  const videoCount = assets.filter((a) => a.fileType === "video").length;
  const totalSizeBytes = assets.reduce((acc, a) => acc + (a.fileSize || 0), 0);

  // Filtered Assets
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.altText && asset.altText.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl text-white shadow-sm shadow-indigo-500/20">
              <UploadCloud className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Media & Video Asset Manager
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Store, preview, and link high-resolution images, video reels, and product demonstrations uploaded directly from your computer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAssets}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl shadow-xs transition"
            title="Refresh assets"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(e) => e.target.files && handleUploadFiles(e.target.files)}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-600/25 transition active:scale-[0.98] disabled:opacity-50"
          >
            {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            <span>Upload from Computer</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Assets</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{assets.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Media files in repository</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <FolderOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Photos</p>
            <p className="text-2xl font-black text-blue-600 mt-1">{imageCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP formats</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <ImageIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Video Reels</p>
            <p className="text-2xl font-black text-purple-600 mt-1">{videoCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">MP4 & WebM clips</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Film className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Disk Storage</p>
            <p className="text-2xl font-black text-indigo-600 mt-1">{formatSize(totalSizeBytes)}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Public assets directory</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <HardDrive className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Banner */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
          isDragOver
            ? "border-blue-500 bg-blue-50/70 scale-[0.99]"
            : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/50"
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-bold text-slate-800">
            {uploading ? uploadProgress : "Drop photos or videos here, or browse from computer"}
          </p>
          <p className="text-xs text-slate-400">
            Supports JPEG, PNG, WEBP, GIF and MP4, WEBM videos up to 100MB
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by file name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {(["all", "image", "video"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                filterType === t
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {t === "all" ? "All Files" : t === "image" ? "Images Only" : "Videos Only"}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Grid */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading media library...</p>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="p-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <FolderOpen className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No media assets found</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Upload images and promotional videos from your system to use throughout your product catalog and combo bundles.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
          >
            Upload Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAssets.map((asset) => {
            const isVideo = asset.fileType === "video";
            const isCopied = copiedId === asset.id;

            return (
              <div
                key={asset.id}
                className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Media Preview Window */}
                <div
                  onClick={() => setPreviewAsset(asset)}
                  className="relative aspect-square w-full bg-slate-950 flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  {isVideo ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
                      <video
                        src={asset.fileUrl}
                        preload="metadata"
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition">
                        <div className="w-10 h-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                          <Play className="w-4 h-4 ml-0.5 fill-slate-900" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[9px] font-mono font-bold rounded">
                        VIDEO
                      </span>
                    </div>
                  ) : (
                    <img
                      src={asset.fileUrl}
                      alt={asset.fileName}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  )}

                  {/* Hover Overlay Toolbar */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewAsset(asset);
                      }}
                      className="p-1.5 bg-white/90 backdrop-blur-xs hover:bg-white text-slate-700 rounded-lg shadow-sm"
                      title="Inspect / Preview"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAsset(asset);
                      }}
                      className="p-1.5 bg-white/90 backdrop-blur-xs hover:bg-rose-600 hover:text-white text-slate-700 rounded-lg shadow-sm"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Info & Copy Link */}
                <div className="p-3 bg-white space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-800 truncate" title={asset.fileName}>
                      {asset.fileName}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>{formatSize(asset.fileSize)}</span>
                    <span className="uppercase">{asset.mimeType?.split("/")[1] || asset.fileType}</span>
                  </div>

                  <button
                    onClick={() => handleCopyUrl(asset)}
                    className={`w-full mt-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-[11px] font-bold transition border ${
                      isCopied
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {isCopied ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? "URL Copied!" : "Copy Link"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL PREVIEW MODAL */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                {previewAsset.fileType === "video" ? (
                  <Film className="w-5 h-5 text-purple-600" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                )}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 truncate max-w-md">{previewAsset.fileName}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">{previewAsset.fileUrl}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewAsset(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 bg-slate-950 flex items-center justify-center p-4 min-h-[350px] max-h-[60vh] overflow-hidden">
              {previewAsset.fileType === "video" ? (
                <video
                  src={previewAsset.fileUrl}
                  controls
                  autoPlay
                  className="max-h-full max-w-full rounded-lg"
                />
              ) : (
                <img
                  src={previewAsset.fileUrl}
                  alt={previewAsset.fileName}
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500 space-x-3">
                <span><strong>Size:</strong> {formatSize(previewAsset.fileSize)}</span>
                <span><strong>Format:</strong> {previewAsset.mimeType}</span>
                <span><strong>Added:</strong> {new Date(previewAsset.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyUrl(previewAsset)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Direct URL</span>
                </button>
                <button
                  onClick={() => handleDeleteAsset(previewAsset)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

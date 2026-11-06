export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/products");

// Ensure directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// GET: List all media assets
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // image, video, all

    const where: any = {};
    if (type && type !== "all") {
      where.fileType = type;
    }

    const assets = await prisma.mediaAsset.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, assets });
  } catch (err: any) {
    console.error("GET /api/admin/media error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Failed to load media." }, { status: 500 });
  }
}

// POST: Upload image or video from system
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. Multipart Form Data (Direct file input from user system)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const files = formData.getAll("file") as File[];
      const uploadedAssets = [];

      for (const file of files) {
        if (!file || typeof file.arrayBuffer !== "function") continue;

        const buffer = Buffer.from(await file.arrayBuffer());
        const originalName = file.name || "media-upload";
        const ext = path.extname(originalName).toLowerCase() || ".jpg";

        // Determine type: video or image
        const isVideo = [".mp4", ".webm", ".mov", ".ogg", ".m4v"].includes(ext) || file.type.startsWith("video/");
        const fileType = isVideo ? "video" : "image";

        const uniqueSuffix = `${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
        const safeBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 40);
        const savedFileName = `${safeBase}_${uniqueSuffix}${ext}`;
        const filePath = path.join(UPLOAD_DIR, savedFileName);

        fs.writeFileSync(filePath, buffer);

        const fileUrl = `/uploads/products/${savedFileName}`;

        // Create MediaAsset record
        const asset = await prisma.mediaAsset.create({
          data: {
            fileName: originalName,
            fileUrl,
            fileType,
            mimeType: file.type || (isVideo ? "video/mp4" : "image/jpeg"),
            fileSize: buffer.length,
            altText: safeBase.replace(/_/g, " "),
          },
        });

        uploadedAssets.push(asset);
      }

      if (uploadedAssets.length === 0) {
        return NextResponse.json({ success: false, error: "No valid files received." }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: `${uploadedAssets.length} file(s) uploaded successfully from system.`,
        assets: uploadedAssets,
        url: uploadedAssets[0].fileUrl, // For single file convenience
      });
    }

    // 2. Base64 or External URL upload payload
    const body = await req.json();
    const { dataUrl, fileName = "system-upload.png", fileType = "image", altText } = body;

    if (!dataUrl) {
      return NextResponse.json({ success: false, error: "Data payload required." }, { status: 400 });
    }

    // Handle Base64 Data URI
    if (dataUrl.startsWith("data:")) {
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return NextResponse.json({ success: false, error: "Invalid data URL format." }, { status: 400 });
      }

      const mimeType = matches[1];
      const buffer = Buffer.from(matches[2], "base64");
      const isVideo = mimeType.startsWith("video/");
      const ext = mimeType.includes("png") ? ".png" : mimeType.includes("webp") ? ".webp" : isVideo ? ".mp4" : ".jpg";

      const uniqueSuffix = `${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
      const savedFileName = `upload_${uniqueSuffix}${ext}`;
      const filePath = path.join(UPLOAD_DIR, savedFileName);

      fs.writeFileSync(filePath, buffer);
      const fileUrl = `/uploads/products/${savedFileName}`;

      const asset = await prisma.mediaAsset.create({
        data: {
          fileName,
          fileUrl,
          fileType: isVideo ? "video" : fileType,
          mimeType,
          fileSize: buffer.length,
          altText: altText || fileName,
        },
      });

      return NextResponse.json({
        success: true,
        message: "File uploaded successfully from system.",
        asset,
        url: asset.fileUrl,
      });
    }

    // Direct URL reference
    const asset = await prisma.mediaAsset.create({
      data: {
        fileName,
        fileUrl: dataUrl,
        fileType,
        mimeType: fileType === "video" ? "video/mp4" : "image/jpeg",
        altText,
      },
    });

    return NextResponse.json({ success: true, asset, url: asset.fileUrl });
  } catch (err: any) {
    console.error("POST /api/admin/media error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Failed to upload file." }, { status: 500 });
  }
}

// DELETE: Delete asset
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Asset ID required." }, { status: 400 });

    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (asset) {
      if (asset.fileUrl.startsWith("/uploads/products/")) {
        const filePath = path.join(process.cwd(), "public", asset.fileUrl);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.warn("Could not remove file on disk:", e);
          }
        }
      }
      await prisma.mediaAsset.delete({ where: { id } });
    }

    return NextResponse.json({ success: true, message: "Asset deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to delete asset." }, { status: 500 });
  }
}

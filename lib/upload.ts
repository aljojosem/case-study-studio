import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 4 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function saveUploadedImage(file: File) {
  const extension = TYPES[file.type];
  if (!extension) {
    throw new Error("Upload a JPG, PNG, WebP, or GIF image.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 4 MB or smaller.");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${randomUUID()}.${extension}`;
  await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

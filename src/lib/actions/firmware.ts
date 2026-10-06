"use server";

import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { db } from "@/db";
import { firmwareVersions } from "@/db/schema";
import { requireRole } from "@/lib/api-auth";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // matches serverActions.bodySizeLimit in next.config.ts

export type UploadFirmwareState = { error: string } | { success: true } | undefined;

export async function uploadFirmwareAction(
  _prevState: UploadFirmwareState,
  formData: FormData,
): Promise<UploadFirmwareState> {
  const user = await requireRole("Superadmin");

  const version = String(formData.get("version") ?? "").trim();
  const file = formData.get("firmware");

  if (!version) {
    return { error: "Version is required." };
  }
  if (!/^\d+(\.\d+)?$/.test(version)) {
    return { error: "Version must be a plain number like 4.0 - the ESP32 compares it as a float." };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please select a firmware .bin file." };
  }
  if (!file.name.endsWith(".bin")) {
    return { error: "Only .bin files are allowed." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { error: "File exceeds the 4 MB size limit." };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      error:
        "File storage isn't set up: add a Vercel Blob store and set BLOB_READ_WRITE_TOKEN.",
    };
  }

  let blob;
  try {
    blob = await put(`firmware/${version}.bin`, file, {
      access: "public",
      addRandomSuffix: true,
    });
  } catch {
    return { error: "Upload to file storage failed. Try again." };
  }

  try {
    await db.insert(firmwareVersions).values({
      version,
      blobUrl: blob.url,
      uploadedBy: user.id,
    });
  } catch {
    return { error: `Version "${version}" already exists.` };
  }

  revalidatePath("/firmware");
  revalidatePath("/dashboard");
  return { success: true };
}

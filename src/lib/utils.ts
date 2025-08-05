import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Compress image before using in PDF
export const compressImage = async (
  imgElement: HTMLImageElement,
): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size to desired dimensions (maintaining aspect ratio)
  const maxWidth = 200; // Max width for logo in PDF
  const scale = maxWidth / imgElement.width;
  canvas.width = maxWidth;
  canvas.height = imgElement.height * scale;

  if (ctx) {
    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw image with compression
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

    // Convert to compressed base64 JPEG
    return canvas.toDataURL("image/jpeg", 0.8); // 0.8 quality gives good balance
  }

  return imgElement.src; // Fallback to original if compression fails
};

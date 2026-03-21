import { readFile } from "@tauri-apps/plugin-fs";

import type { ImageItem } from "@/domain/model/types";

function loadImageDimensions(imageUrl: string): Promise<{ widthPx: number; heightPx: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve({
        widthPx: image.naturalWidth,
        heightPx: image.naturalHeight,
      });
    };

    image.onerror = () => {
      reject(new Error("Unable to read image dimensions."));
    };

    image.src = imageUrl;
  });
}

function createImageId(seed: string, index: number): string {
  return `${seed}-${index}`;
}

function getBaseName(path: string): string {
  const normalized = path.replaceAll("\\", "/");
  const segments = normalized.split("/");
  return segments[segments.length - 1] ?? path;
}

function getExtension(path: string): string {
  const fileName = getBaseName(path);
  const parts = fileName.split(".");
  return parts.length > 1 ? (parts[parts.length - 1] ?? "").toLowerCase() : "";
}

function getMimeType(path: string): string {
  switch (getExtension(path)) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "bmp":
      return "image/bmp";
    default:
      return "application/octet-stream";
  }
}

export async function filesToImageItems(files: FileList | File[]): Promise<ImageItem[]> {
  const selectedFiles = Array.from(files);

  return Promise.all(
    selectedFiles.map(async (file, index) => {
      const objectUrl = URL.createObjectURL(file);
      const dimensions = await loadImageDimensions(objectUrl);

      return {
        id: createImageId(`${file.name}-${file.lastModified}`, index),
        name: file.name,
        path: file.name,
        dimensions,
        thumbnailUrl: objectUrl,
        thumbnailUrlKind: "object-url",
      };
    }),
  );
}

export async function pathsToImageItems(paths: string[]): Promise<ImageItem[]> {
  return Promise.all(
    paths.map(async (path, index) => {
      const imageBytes = await readFile(path);
      const objectUrl = URL.createObjectURL(new Blob([imageBytes], { type: getMimeType(path) }));
      const dimensions = await loadImageDimensions(objectUrl);

      return {
        id: createImageId(path, index),
        name: getBaseName(path),
        path,
        dimensions,
        thumbnailUrl: objectUrl,
        thumbnailUrlKind: "object-url",
      };
    }),
  );
}

import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";

import { isDesktopApp } from "@/utils/platform";

function triggerBrowserDownload(filename: string, bytes: Uint8Array): void {
  const normalizedBytes = new Uint8Array(bytes.byteLength);

  normalizedBytes.set(bytes);

  const blob = new Blob([normalizedBytes.buffer], { type: "application/pdf" });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = filename;
  link.click();

  setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 0);
}

export async function savePdfBytes(
  suggestedFilename: string,
  bytes: Uint8Array,
): Promise<"saved" | "cancelled"> {
  if (!isDesktopApp()) {
    triggerBrowserDownload(suggestedFilename, bytes);
    return "saved";
  }

  const selectedPath = await save({
    defaultPath: suggestedFilename,
    filters: [
      {
        name: "PDF",
        extensions: ["pdf"],
      },
    ],
  });

  if (!selectedPath) {
    return "cancelled";
  }

  await writeFile(selectedPath, bytes);
  return "saved";
}

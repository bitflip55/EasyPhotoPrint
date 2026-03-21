import { invoke } from "@tauri-apps/api/core";

import { isDesktopApp } from "@/utils/platform";

export async function openExternalUrl(url: string): Promise<void> {
  if (!isDesktopApp()) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  await invoke("open_external_url", { url });
}

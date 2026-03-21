import type { PersistedProjectSettings, ProjectSettings } from "@/domain/model/types";

const STORAGE_KEY = "easy-photo-print.settings.v1";

export function loadPersistedSettings(): ProjectSettings | null {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as PersistedProjectSettings;

    return parsed.settings ?? null;
  } catch {
    return null;
  }
}

export function savePersistedSettings(settings: ProjectSettings): void {
  const payload: PersistedProjectSettings = { settings };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

import type { Dispatch } from "react";
import { useEffect, useMemo, useReducer } from "react";

import { computeLayoutDocument } from "@/domain/layout";
import type { ProjectDocument } from "@/domain/model/types";
import type { ProjectAction } from "@/state/actions";
import { createDefaultProjectDocument } from "@/state/defaults";
import { projectReducer } from "@/state/reducer";
import { buildRenderDocument } from "@/render/preview";
import { loadPersistedSettings, savePersistedSettings } from "@/utils/persistence";

function createInitialProjectState(): ProjectDocument {
  const persistedSettings = loadPersistedSettings();
  return createDefaultProjectDocument(persistedSettings ?? undefined);
}

export function useProjectState() {
  const [project, dispatch] = useReducer(projectReducer, undefined, createInitialProjectState);

  const layoutDocument = useMemo(
    () =>
      computeLayoutDocument({
        page: project.settings.page,
        grid: project.settings.grid,
        images: project.images,
        placementMode: project.settings.placementMode,
        centerImages: project.settings.centerImages,
        printCopies: project.settings.printCopies,
      }),
    [project],
  );

  const renderDocument = useMemo(
    () => buildRenderDocument(layoutDocument),
    [layoutDocument],
  );

  useEffect(() => {
    savePersistedSettings(project.settings);
  }, [project.settings]);

  return {
    project,
    layoutDocument,
    renderDocument,
    dispatch: dispatch as Dispatch<ProjectAction>,
  };
}

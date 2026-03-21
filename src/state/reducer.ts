import type { ProjectDocument } from "@/domain/model/types";
import type { ProjectAction } from "@/state/actions";
import { PAGE_FORMAT_DIMENSIONS } from "@/state/defaults";

export function projectReducer(
  state: ProjectDocument,
  action: ProjectAction,
): ProjectDocument {
  switch (action.type) {
    case "project/reset":
      return action.payload;
    case "images/add":
      return {
        ...state,
        images: [...state.images, ...action.payload],
      };
    case "images/remove":
      return {
        ...state,
        images: state.images.filter((image) => image.id !== action.payload.id),
      };
    case "settings/updateGrid":
      return {
        ...state,
        settings: {
          ...state.settings,
          grid: {
            ...state.settings.grid,
            ...action.payload,
          },
        },
      };
    case "settings/updateMargins":
      return {
        ...state,
        settings: {
          ...state.settings,
          page: {
            ...state.settings.page,
            margins: {
              ...state.settings.page.margins,
              ...action.payload,
            },
          },
        },
      };
    case "settings/updateSpacing":
      return {
        ...state,
        settings: {
          ...state.settings,
          page: {
            ...state.settings.page,
            spacing: {
              ...state.settings.page.spacing,
              ...action.payload,
            },
          },
        },
      };
    case "settings/updatePageFormat": {
      const dimensions = PAGE_FORMAT_DIMENSIONS[action.payload.format];

      return {
        ...state,
        settings: {
          ...state.settings,
          page: {
            ...state.settings.page,
            format: action.payload.format,
            widthMm: dimensions.widthMm,
            heightMm: dimensions.heightMm,
          },
        },
      };
    }
    case "settings/updateOrientation":
      return {
        ...state,
        settings: {
          ...state.settings,
          page: {
            ...state.settings.page,
            orientation: action.payload.orientation,
          },
        },
      };
    case "settings/updatePlacementMode":
      return {
        ...state,
        settings: {
          ...state.settings,
          placementMode: action.payload.placementMode,
        },
      };
    case "settings/updateCenterImages":
      return {
        ...state,
        settings: {
          ...state.settings,
          centerImages: action.payload.centerImages,
        },
      };
    case "settings/updatePrintCopies":
      return {
        ...state,
        settings: {
          ...state.settings,
          printCopies: action.payload.printCopies,
        },
      };
    default:
      return state;
  }
}

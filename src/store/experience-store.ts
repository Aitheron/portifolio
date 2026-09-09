import {create} from "zustand";

import type {AppLocale} from "@/i18n/routing";
import type {
  ClusterId,
  ExperienceStage,
  PerformanceQuality,
} from "@/lib/portfolio-types";

type ExperienceState = {
  locale: AppLocale;
  stage: ExperienceStage;
  selectedClusterId: ClusterId | null;
  selectedNodeId: string | null;
  languageSignal: AppLocale | null;
  quality: PerformanceQuality;
  reducedMotion: boolean;
  cameraResetRevision: number;
  setLocale: (locale: AppLocale) => void;
  openLanguageGateway: () => void;
  beginEntering: (locale: AppLocale) => void;
  completeEntering: () => void;
  focusCluster: (clusterId: ClusterId) => void;
  selectNode: (nodeId: string, clusterId: ClusterId) => void;
  closeNode: () => void;
  returnToOverview: () => void;
  navigateBack: () => void;
  setQuality: (quality: PerformanceQuality) => void;
  setReducedMotion: (reducedMotion: boolean) => void;
};

export const useExperienceStore = create<ExperienceState>()((set, get) => ({
  locale: "pt",
  stage: "intro",
  selectedClusterId: null,
  selectedNodeId: null,
  languageSignal: null,
  quality: "medium",
  reducedMotion: false,
  cameraResetRevision: 0,
  setLocale: (locale) => set({locale}),
  openLanguageGateway: () => set({stage: "language-selection"}),
  beginEntering: (locale) => set({stage: "entering", languageSignal: locale}),
  completeEntering: () =>
    set((state) => ({
      stage: state.selectedNodeId
        ? "node-details"
        : state.selectedClusterId
          ? "cluster-focus"
          : "overview",
      languageSignal: null,
    })),
  focusCluster: (selectedClusterId) =>
    set({stage: "cluster-focus", selectedClusterId, selectedNodeId: null}),
  selectNode: (selectedNodeId, selectedClusterId) =>
    set({stage: "node-details", selectedNodeId, selectedClusterId}),
  closeNode: () =>
    set((state) => ({
      stage: state.selectedClusterId ? "cluster-focus" : "overview",
      selectedNodeId: null,
    })),
  returnToOverview: () =>
    set((state) => ({
      stage: "overview",
      selectedClusterId: null,
      selectedNodeId: null,
      cameraResetRevision: state.cameraResetRevision + 1,
    })),
  navigateBack: () => {
    const state = get();
    if (state.stage === "node-details") {
      state.closeNode();
    } else if (state.stage === "cluster-focus") {
      state.returnToOverview();
    } else if (state.stage === "language-selection") {
      set({stage: "intro"});
    }
  },
  setQuality: (quality) => set({quality}),
  setReducedMotion: (reducedMotion) => set({reducedMotion}),
}));

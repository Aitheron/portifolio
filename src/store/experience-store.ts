import {create} from "zustand";

import type {AppLocale, ClusterId, ExperienceStage, PerformanceQuality} from "../lib/portfolio-types";

type ExperienceState = {
  locale: AppLocale;
  stage: ExperienceStage;
  resumeStage: ExperienceStage;
  selectedClusterId: ClusterId | null;
  selectedNodeId: string | null;
  languageSignal: AppLocale | null;
  quality: PerformanceQuality;
  reducedMotion: boolean;
  focusReady: boolean;
  cameraResetRevision: number;
  setLocale: (locale: AppLocale) => void;
  openLanguageGateway: () => void;
  beginEntering: (locale: AppLocale) => void;
  completeEntering: () => void;
  focusCluster: (clusterId: ClusterId) => void;
  focusIdentity: () => void;
  focusNode: (nodeId: string, clusterId: ClusterId, ready?: boolean) => void;
  completeNodeFocus: (nodeId: string) => void;
  openCase: () => void;
  openNodeCase: (nodeId: string, clusterId: ClusterId) => void;
  closeCase: () => void;
  closeNode: () => void;
  returnToOverview: () => void;
  navigateBack: () => void;
  setQuality: (quality: PerformanceQuality) => void;
  setReducedMotion: (reducedMotion: boolean) => void;
};

export const useExperienceStore = create<ExperienceState>()((set, get) => ({
  locale: "pt", stage: "intro", resumeStage: "overview",
  selectedClusterId: null, selectedNodeId: null, languageSignal: null,
  quality: "medium", reducedMotion: false, focusReady: false, cameraResetRevision: 0,
  setLocale: (locale) => set({locale}),
  openLanguageGateway: () => set({stage: "language-selection"}),
  beginEntering: (languageSignal) => set((state) => ({
    stage: "entering", languageSignal,
    resumeStage: state.stage === "entering" ? state.resumeStage
      : state.stage === "intro" || state.stage === "language-selection" ? "overview" : state.stage,
  })),
  completeEntering: () => set((state) => ({stage: state.resumeStage, languageSignal: null})),
  focusIdentity: () => set({
    stage: "identity-focus", selectedClusterId: null, selectedNodeId: null, focusReady: false,
  }),
  focusCluster: (selectedClusterId) => set({
    stage: "cluster-focus", selectedClusterId, selectedNodeId: null, focusReady: false,
  }),
  focusNode: (selectedNodeId, selectedClusterId, ready = false) => set((state) => ({
    stage: "node-focus", selectedNodeId, selectedClusterId,
    focusReady: ready || (state.selectedNodeId === selectedNodeId && state.focusReady),
  })),
  completeNodeFocus: (nodeId) => {
    const state = get();
    if (state.selectedNodeId === nodeId && !state.focusReady) set({focusReady: true});
  },
  openCase: () => {
    const state = get();
    if (state.stage === "node-focus" && state.focusReady) set({stage: "node-details"});
  },
  openNodeCase: (selectedNodeId, selectedClusterId) => set({
    stage: "node-details", selectedNodeId, selectedClusterId, focusReady: true,
  }),
  closeCase: () => {
    if (get().stage === "node-details") set({stage: "node-focus"});
  },
  closeNode: () => set((state) => ({
    stage: state.selectedClusterId ? "cluster-focus" : "overview",
    selectedNodeId: null, focusReady: false,
  })),
  returnToOverview: () => set((state) => ({
    stage: "overview", resumeStage: "overview", selectedClusterId: null, selectedNodeId: null, focusReady: false,
    cameraResetRevision: state.cameraResetRevision + 1,
  })),
  navigateBack: () => {
    const state = get();
    if (state.stage === "node-details") state.closeCase();
    else if (state.stage === "node-focus") state.closeNode();
    else if (state.stage === "cluster-focus" || state.stage === "identity-focus") state.returnToOverview();
    else if (state.stage === "language-selection") set({stage: "intro"});
  },
  setQuality: (quality) => set({quality}),
  setReducedMotion: (reducedMotion) => set({reducedMotion}),
}));

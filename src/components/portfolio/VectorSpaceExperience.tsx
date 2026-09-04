"use client";

import dynamic from "next/dynamic";
import {useCallback, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";

import {portfolioNodes} from "@/content/nodes";
import type {AppLocale} from "@/i18n/routing";
import {detectPerformanceQuality} from "@/lib/performance-quality";
import {useExperienceStore} from "@/store/experience-store";

import {LanguageGateway} from "./LanguageGateway";
import {NodeDetailsPanel} from "./NodeDetailsPanel";
import {PortfolioHUD} from "./PortfolioHUD";
import {VectorSpaceFallback} from "./VectorSpaceFallback";

type VectorSpaceExperienceProps = {
  locale: AppLocale;
};

const UniverseCanvas = dynamic(() => import("@/components/three/UniverseCanvas"), {
  ssr: false,
  loading: () => <div className="canvas-loading" aria-hidden="true" />,
});

export function VectorSpaceExperience({locale}: VectorSpaceExperienceProps) {
  const router = useRouter();
  const intro = useTranslations("Intro");
  const canvas = useTranslations("Canvas");
  const [webglStatus, setWebglStatus] = useState<"checking" | "available" | "unavailable">("checking");
  const stage = useExperienceStore((state) => state.stage);
  const selectedNodeId = useExperienceStore((state) => state.selectedNodeId);
  const languageSignal = useExperienceStore((state) => state.languageSignal);
  const activeLocale = useExperienceStore((state) => state.locale);
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);
  const setLocale = useExperienceStore((state) => state.setLocale);
  const openLanguageGateway = useExperienceStore((state) => state.openLanguageGateway);
  const beginEntering = useExperienceStore((state) => state.beginEntering);
  const completeEntering = useExperienceStore((state) => state.completeEntering);
  const closeNode = useExperienceStore((state) => state.closeNode);
  const navigateBack = useExperienceStore((state) => state.navigateBack);
  const returnToOverview = useExperienceStore((state) => state.returnToOverview);
  const setReducedMotion = useExperienceStore((state) => state.setReducedMotion);
  const setQuality = useExperienceStore((state) => state.setQuality);
  const selectedNode = portfolioNodes.find((node) => node.id === selectedNodeId) ?? null;
  const isNavigating = stage === "language-selection" || stage === "entering";
  const isUniverse = stage === "overview" || stage === "cluster-focus" || stage === "node-details";

  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyPreferences = () => {
      setReducedMotion(motionQuery.matches);
      setQuality(detectPerformanceQuality(motionQuery.matches));
    };
    applyPreferences();
    motionQuery.addEventListener("change", applyPreferences);

    const probe = document.createElement("canvas");
    const context = probe.getContext("webgl2") ?? probe.getContext("webgl");
    setWebglStatus(context ? "available" : "unavailable");
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return () => motionQuery.removeEventListener("change", applyPreferences);
  }, [setQuality, setReducedMotion]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      const isEditing = target instanceof HTMLElement && (
        target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      );
      if (isEditing || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Escape") navigateBack();
      if (event.key.toLowerCase() === "h") returnToOverview();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateBack, returnToOverview]);

  const changeLocale = useCallback((nextLocale: AppLocale) => {
    beginEntering(nextLocale);
    const duration = reducedMotion ? 120 : 850;
    window.setTimeout(() => {
      const state = useExperienceStore.getState();
      const query = new URLSearchParams();
      if (state.selectedClusterId) query.set("cluster", state.selectedClusterId);
      if (state.selectedNodeId) query.set("node", state.selectedNodeId);
      const suffix = query.size > 0 ? `?${query.toString()}` : "";
      if (nextLocale !== locale) router.replace(`/${nextLocale}${suffix}`);
      setLocale(nextLocale);
      completeEntering();
    }, duration);
  }, [beginEntering, completeEntering, locale, reducedMotion, router, setLocale]);

  return (
    <main className="experience-shell" data-stage={stage}>
      <div className="ambient-vectors" aria-hidden="true">
        {Array.from({length: 18}, (_, index) => <i key={index} />)}
      </div>

      {webglStatus === "available" && stage !== "intro" && (
        <UniverseCanvas onUnavailable={() => setWebglStatus("unavailable")} />
      )}
      {webglStatus === "checking" && <span className="sr-only">{canvas("loading")}</span>}

      {stage === "intro" && (
        <section className="intro-panel" aria-labelledby="intro-title">
          <p className="eyebrow">{intro("eyebrow")}</p>
          <h1 id="intro-title">{intro("name")}</h1>
          <p className="intro-role">{intro("role")}</p>
          <p className="intro-statement">{intro("statement")}</p>
          <button className="primary-action" type="button" onClick={openLanguageGateway}>
            <span>{intro("enter")}</span>
            <span aria-hidden="true">↗</span>
          </button>
          <p className="intro-status"><i aria-hidden="true" /> {intro("status")}</p>
        </section>
      )}

      {isNavigating && (
        <LanguageGateway selectedLocale={languageSignal} onSelect={changeLocale} />
      )}

      {isUniverse && (
        <>
          <h1 className="sr-only">Marlon // Vector Space</h1>
          <PortfolioHUD onLocaleChange={changeLocale} />
          {webglStatus === "unavailable" && (
            <VectorSpaceFallback locale={activeLocale} webglUnavailable />
          )}
        </>
      )}

      {selectedNode && stage === "node-details" && (
        <NodeDetailsPanel node={selectedNode} locale={activeLocale} onClose={closeNode} />
      )}
    </main>
  );
}

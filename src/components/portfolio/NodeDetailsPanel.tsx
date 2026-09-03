"use client";

import {useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";

import {clusterById} from "@/content/clusters";
import type {AppLocale} from "@/i18n/routing";
import {resolveLocalizedText} from "@/lib/portfolio-types";
import type {PortfolioNode} from "@/lib/portfolio-types";

import {ProceduralCover} from "./ProceduralCover";

type NodeDetailsPanelProps = {
  node: PortfolioNode;
  locale: AppLocale;
  onClose: () => void;
};

export function NodeDetailsPanel({node, locale, onClose}: NodeDetailsPanelProps) {
  const t = useTranslations("Details");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const cluster = clusterById[node.cluster];
  const title = resolveLocalizedText(node.title, locale);

  useEffect(() => {
    const dialog = dialogRef.current;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    setImageFailed(false);
    if (dialog && !dialog.open) dialog.showModal();

    return () => restoreFocusRef.current?.focus();
  }, [node.id]);

  return (
    <dialog
      ref={dialogRef}
      className="node-dialog"
      aria-labelledby="node-dialog-title"
      onClose={onClose}
    >
      <div className="node-dialog__inner">
        <button
          type="button"
          className="dialog-close"
          aria-label={t("close")}
          onClick={() => dialogRef.current?.close()}
          autoFocus
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="node-dialog__visual">
          {node.image && !imageFailed ? (
            <img
              src={node.image.src}
              alt={resolveLocalizedText(node.image.alt, locale)}
              width={960}
              height={540}
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <ProceduralCover node={node} locale={locale} />
          )}
        </div>

        <div className="node-dialog__content">
          <p className="eyebrow">
            {t("cluster")} / {resolveLocalizedText(cluster.title, locale)}
          </p>
          <h2 id="node-dialog-title">{title}</h2>
          <p className="node-summary">{resolveLocalizedText(node.summary, locale)}</p>
          <p className="node-description">
            {resolveLocalizedText(node.description, locale)}
          </p>

          <section className="node-taxonomy" aria-labelledby="technology-title">
            <h3 id="technology-title">{t("technologies")}</h3>
            <ul>
              {node.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </section>

          <section className="node-taxonomy" aria-labelledby="tags-title">
            <h3 id="tags-title">{t("tags")}</h3>
            <ul>
              {node.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </section>

          {node.links && node.links.length > 0 && (
            <section className="node-links" aria-labelledby="links-title">
              <h3 id="links-title">{t("links")}</h3>
              {node.links.map((link) => {
                const label = resolveLocalizedText(link.label, locale);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={t("openLink", {label})}
                  >
                    {label} <span aria-hidden="true">↗</span>
                  </a>
                );
              })}
            </section>
          )}
        </div>
      </div>
    </dialog>
  );
}

import {useEffect, useRef} from "react";
import {useTranslations} from "next-intl";

import type {AppLocale} from "@/lib/portfolio-types";
import {VectorSpaceFallback} from "./VectorSpaceFallback";

export function SemanticExplorer({locale, onClose}: {locale: AppLocale; onClose: () => void}) {
  const t = useTranslations("HUD");
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialog.current?.showModal();
    return () => {requestAnimationFrame(() => document.getElementById("career-explorer-action")?.focus());};
  }, []);

  return (
    <dialog ref={dialog} className="semantic-explorer" aria-label={t("explore")} onClose={onClose}
      onCancel={(event) => {event.preventDefault(); event.stopPropagation(); dialog.current?.close();}}>
      <button className="dialog-close" type="button" autoFocus aria-label={t("closeExplorer")} onClick={() => dialog.current?.close()}><span aria-hidden="true">×</span></button>
      <VectorSpaceFallback locale={locale} onNavigate={() => dialog.current?.close()} />
    </dialog>
  );
}

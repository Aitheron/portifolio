import {useRef} from "react";

import {identity} from "@/content/identity";
import {resolveIdentityActionHref} from "@/lib/identity-actions";
import {resolveLocalizedText} from "@/lib/portfolio-types";
import type {AppLocale} from "@/lib/portfolio-types";

const indicators = {linkedin: "in", github: "⌘", email: "@", resume: "↓"};

type IdentityActionsProps = {
  locale: AppLocale;
  visible: boolean;
  spatial?: boolean;
  labels: {contactActions: string; unavailable: string; downloadPdf: string};
};

export function IdentityActions({locale, visible, spatial = false, labels}: IdentityActionsProps) {
  const pointer = useRef<{x: number; y: number; moved: boolean} | null>(null);

  return (
    <nav className={`identity-actions${spatial ? " identity-actions--spatial" : ""}${visible ? " is-visible" : ""}`}
      aria-label={labels.contactActions} aria-hidden={!visible} inert={!visible}
      onPointerDown={(event) => {
        event.stopPropagation();
        pointer.current = {x: event.clientX, y: event.clientY, moved: false};
      }}
      onPointerMove={(event) => {
        if (pointer.current && Math.hypot(event.clientX - pointer.current.x, event.clientY - pointer.current.y) > 6) pointer.current.moved = true;
      }}
      onPointerCancel={() => {if (pointer.current) pointer.current.moved = true;}}
      onClick={(event) => {
        event.stopPropagation();
        if (event.detail > 0 && pointer.current?.moved) event.preventDefault();
        pointer.current = null;
      }}>
      {identity.actions.map((action) => {
        const href = resolveIdentityActionHref(action, locale);
        const label = resolveLocalizedText(action.label, locale);
        const external = href?.startsWith("https:") && (action.external ?? true);
        // Browsers honor download for same-origin files; external resumes remain viewable links.
        const download = action.type === "resume" && href?.startsWith("/") ? action.download : undefined;
        const content = <><span className="identity-action__indicator" aria-hidden="true">{indicators[action.type]}</span><span>{label}</span></>;
        return href ? (
          <a key={action.id} className="identity-action" href={href} target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined} download={download}>
            {content}
            {download && <small>{labels.downloadPdf}</small>}
          </a>
        ) : (
          <span key={action.id} className="identity-action identity-action--unavailable" role="link" aria-disabled="true"
            aria-label={`${label} — ${labels.unavailable}`} title={labels.unavailable}>
            {content}<small>{labels.unavailable}</small>
          </span>
        );
      })}
    </nav>
  );
}

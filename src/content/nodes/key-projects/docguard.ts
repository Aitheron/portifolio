import type {PortfolioNode} from "@/lib/portfolio-types";

export default {
  "id": "docguard",
  "slug": "docguard",
  "kind": "project",
  "cluster": "key-projects",
  "title": {
    "pt": "DocGuard",
    "en": "DocGuard"
  },
  "summary": {
    "pt": "Protótipo de segurança de IA e sanitização de documentos.",
    "en": "AI security and document sanitization prototype."
  },
  "description": {
    "pt": "Descrição provisória. O case detalhado e suas evidências serão adicionados em uma próxima etapa.",
    "en": "Provisional description. The detailed case and its evidence will be added in a later content pass."
  },
  "projectType": {
    "pt": "Protótipo",
    "en": "Prototype"
  },
  "importance": "secondary",
  "provisional": true,
  "confidential": false,
  "technologies": [],
  "tags": [],
  "satellites": [
    {
      "id": "pii",
      "type": "domain",
      "label": {
        "pt": "PII",
        "en": "PII"
      },
      "importance": 1.0
    },
    {
      "id": "sanitization",
      "type": "concept",
      "label": {
        "pt": "Sanitização",
        "en": "Sanitization"
      },
      "importance": 0.9
    },
    {
      "id": "privacy",
      "type": "concept",
      "label": {
        "pt": "Privacidade",
        "en": "Privacy"
      },
      "importance": 0.8
    },
    {
      "id": "safe-ai",
      "type": "concept",
      "label": {
        "pt": "IA Segura",
        "en": "Safe AI"
      },
      "importance": 0.7
    },
    {
      "id": "ner",
      "type": "technology",
      "label": {
        "pt": "NER",
        "en": "NER"
      },
      "importance": 0.6
    },
    {
      "id": "security",
      "type": "domain",
      "label": {
        "pt": "Segurança",
        "en": "Security"
      },
      "importance": 0.5
    }
  ],
  "relations": [],
  "visual": {
    "variant": "data-node",
    "size": 0.82,
    "intensity": 1
  },
  "position": {
    "mode": "auto"
  }
} satisfies PortfolioNode;

import type {PortfolioNode} from "@/lib/portfolio-types";

export default {
  "id": "pn-extractor",
  "slug": "pn-extractor",
  "kind": "project",
  "cluster": "key-projects",
  "title": {
    "pt": "PN Extractor",
    "en": "PN Extractor"
  },
  "summary": {
    "pt": "Da extração de documentos à validação de dados estruturados.",
    "en": "From document extraction to validated structured data."
  },
  "description": {
    "pt": "Descrição provisória. O case detalhado e suas evidências serão adicionados em uma próxima etapa.",
    "en": "Provisional description. The detailed case and its evidence will be added in a later content pass."
  },
  "projectType": {
    "pt": "Projeto profissional",
    "en": "Professional project"
  },
  "importance": "primary",
  "provisional": true,
  "confidential": true,
  "technologies": [],
  "tags": [],
  "satellites": [
    {
      "id": "document-ai",
      "type": "domain",
      "label": {
        "pt": "IA para Documentos",
        "en": "Document AI"
      },
      "importance": 1.0
    },
    {
      "id": "extraction",
      "type": "concept",
      "label": {
        "pt": "Extração",
        "en": "Extraction"
      },
      "importance": 0.9
    },
    {
      "id": "validation",
      "type": "concept",
      "label": {
        "pt": "Validação",
        "en": "Validation"
      },
      "importance": 0.8
    },
    {
      "id": "time",
      "type": "metric",
      "label": {
        "pt": "6h → ~15min",
        "en": "6h → ~15min"
      },
      "importance": 0.7
    },
    {
      "id": "accuracy",
      "type": "metric",
      "label": {
        "pt": "~98% de acurácia",
        "en": "~98% accuracy"
      },
      "importance": 0.6
    },
    {
      "id": "automation",
      "type": "concept",
      "label": {
        "pt": "Automação",
        "en": "Automation"
      },
      "importance": 0.5
    }
  ],
  "relations": [
    {
      "targetId": "professional-experience",
      "type": "related-to"
    }
  ],
  "visual": {
    "variant": "data-node",
    "size": 1.03,
    "intensity": 1
  },
  "position": {
    "mode": "auto"
  }
} satisfies PortfolioNode;

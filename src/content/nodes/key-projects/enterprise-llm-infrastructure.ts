import type {PortfolioNode} from "@/lib/portfolio-types";

export default {
  "id": "enterprise-llm-infrastructure",
  "slug": "enterprise-llm-infrastructure",
  "kind": "project",
  "cluster": "key-projects",
  "title": {
    "pt": "Enterprise LLM Infrastructure",
    "en": "Enterprise LLM Infrastructure"
  },
  "summary": {
    "pt": "Infraestrutura de IA para roteamento, confiabilidade e observabilidade.",
    "en": "AI infrastructure for routing, reliability and observability."
  },
  "description": {
    "pt": "Descrição provisória. O case detalhado e suas evidências serão adicionados em uma próxima etapa.",
    "en": "Provisional description. The detailed case and its evidence will be added in a later content pass."
  },
  "projectType": {
    "pt": "Infraestrutura de IA em produção",
    "en": "Production AI infrastructure"
  },
  "importance": "primary",
  "provisional": true,
  "confidential": true,
  "technologies": [
    "LiteLLM"
  ],
  "tags": [],
  "satellites": [
    {
      "id": "litellm",
      "type": "technology",
      "label": {
        "pt": "LiteLLM",
        "en": "LiteLLM"
      },
      "importance": 1.0
    },
    {
      "id": "routing",
      "type": "concept",
      "label": {
        "pt": "Roteamento",
        "en": "Routing"
      },
      "importance": 0.9
    },
    {
      "id": "multi-provider",
      "type": "concept",
      "label": {
        "pt": "Múltiplos provedores",
        "en": "Multi-provider"
      },
      "importance": 0.8
    },
    {
      "id": "reliability",
      "type": "concept",
      "label": {
        "pt": "Confiabilidade",
        "en": "Reliability"
      },
      "importance": 0.7
    },
    {
      "id": "observability",
      "type": "concept",
      "label": {
        "pt": "Observabilidade",
        "en": "Observability"
      },
      "importance": 0.6
    },
    {
      "id": "production-ai",
      "type": "domain",
      "label": {
        "pt": "IA em Produção",
        "en": "Production AI"
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
    "variant": "system-module",
    "size": 1.03,
    "intensity": 1
  },
  "position": {
    "mode": "auto"
  }
} satisfies PortfolioNode;

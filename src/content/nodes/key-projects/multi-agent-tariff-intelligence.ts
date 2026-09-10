import type {PortfolioNode} from "@/lib/portfolio-types";

export default {
  "id": "multi-agent-tariff-intelligence",
  "slug": "multi-agent-tariff-intelligence",
  "kind": "project",
  "cluster": "key-projects",
  "title": {
    "pt": "Multi-Agent Tariff Intelligence",
    "en": "Multi-Agent Tariff Intelligence"
  },
  "summary": {
    "pt": "Sistemas multiagentes no contexto de fluxos empresariais.",
    "en": "Multi-agent systems in the context of enterprise workflows."
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
      "id": "agents",
      "type": "concept",
      "label": {
        "pt": "Agentes",
        "en": "Agents"
      },
      "importance": 1.0
    },
    {
      "id": "enterprise-ai",
      "type": "domain",
      "label": {
        "pt": "IA Empresarial",
        "en": "Enterprise AI"
      },
      "importance": 0.9
    },
    {
      "id": "automation",
      "type": "concept",
      "label": {
        "pt": "Automação",
        "en": "Automation"
      },
      "importance": 0.8
    },
    {
      "id": "validation",
      "type": "concept",
      "label": {
        "pt": "Validação",
        "en": "Validation"
      },
      "importance": 0.7
    },
    {
      "id": "llms",
      "type": "technology",
      "label": {
        "pt": "LLMs",
        "en": "LLMs"
      },
      "importance": 0.6
    },
    {
      "id": "efficiency",
      "type": "metric",
      "label": {
        "pt": "+70% de eficiência",
        "en": "+70% efficiency"
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
    "variant": "agent-network",
    "size": 1.03,
    "intensity": 1
  },
  "position": {
    "mode": "auto"
  }
} satisfies PortfolioNode;

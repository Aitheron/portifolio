# Marlon // Vector Space

Portfólio bilíngue de Marlon de Souza apresentado como um espaço vetorial semântico explorável. O projeto usa Next.js, React, TypeScript, Tailwind CSS, Three.js, React Three Fiber, Drei, next-intl, Zustand e Zod.

## Instalação

Requer Node.js 20.9 ou mais recente e npm.

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000/pt` ou `http://localhost:3000/en`.

## Build de produção

```bash
npm run build
npm start
```

## Arquitetura

- `src/content/nodes`: um arquivo de dados serializáveis por item do portfólio.
- `src/content/nodes/index.ts`: registro explícito que valida todos os itens com Zod.
- `src/content/clusters.ts`: posições, aparência e layout determinístico dos clusters.
- `src/lib/scene-config.ts`: limites de navegação e níveis de reconstrução visual.
- `src/components/three`: renderização genérica do universo, clusters, QUERY e nós.
- `src/components/portfolio`: interface HTML acessível, HUD, detalhes e fallback WebGL.
- `src/messages`: textos globais em português e inglês.

As capas são ativadas somente quando a câmera se aproxima e são reconstruídas por fragmentos reais da textura nos modos `high` e `medium`. O modo `low` usa dissolve. Uma capa procedural baseada no cluster passa pelo mesmo pipeline quando não existe `image` ou quando o carregamento falha.

A câmera orbita sempre um alvo semântico e aplica limites próprios para overview e clusters. Use o botão do HUD ou a tecla `H` para centralizar a visão; `Escape` retorna de projeto para cluster e de cluster para overview.

## Como adicionar um item ao portfólio

1. Copie um arquivo existente da pasta do cluster correspondente em `src/content/nodes`.
2. Altere `id`, `slug` e todo o conteúdo localizado.
3. Escolha uma variante suportada: `data-node`, `genomic-nebula`, `agent-network`, `system-module` ou `human-signal`.
4. Importe o novo objeto em `src/content/nodes/index.ts`.
5. Adicione o objeto a `registeredNodes`.
6. Execute `npm run build` para validar tipos, schema e relacionamentos.

O novo item será posicionado e renderizado automaticamente. Use `position: {mode: "manual", value: [x, y, z]}` apenas quando precisar de direção de arte específica.

## Como adicionar um cluster

Estenda `clusterIds` e os tipos derivados em `src/lib/portfolio-types.ts`, adicione a configuração bilíngue em `src/content/clusters.ts`, inclua as traduções globais necessárias e crie um novo mapeamento procedural em `SemanticCluster` ou `PortfolioNodeMesh` somente se o cluster exigir uma linguagem visual ainda não suportada.

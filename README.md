# Marlon // Vector Space

Portfólio bilíngue de Marlon de Souza apresentado como um grafo espacial de carreira. A V2 evolui o universo da V1 com uma identidade central, quatro regiões de carreira e micro-universos de projetos. O projeto usa Next.js, React, TypeScript, Tailwind CSS, Three.js, React Three Fiber, Drei, next-intl, Zustand e Zod.

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
- `src/content/identity.ts`: identidade central, resumo, imagem opcional, sinais semânticos e ações de contato.
- `src/content/clusters.ts`: posições, aparência e layout determinístico dos clusters.
- `src/lib/portfolio-graph.ts`: índice derivado das entidades existentes, sem duplicar conteúdo.
- `src/lib/satellite-layout.ts`: distribuição determinística, relevância e limites dos satélites.
- `src/lib/scene-config.ts`: limites de navegação e níveis de reconstrução visual.
- `src/components/three`: renderização genérica do universo, identidade, clusters, nós e micro-universos.
- `src/components/portfolio`: HUD, exploração HTML acessível, cases e fallback WebGL.
- `src/messages`: textos globais em português e inglês.

As capas são ativadas somente quando a câmera se aproxima e são reconstruídas por fragmentos reais da textura nos modos `high` e `medium`. O modo `low` usa dissolve. Uma capa procedural baseada no cluster passa pelo mesmo pipeline quando não existe `image` ou quando o carregamento falha.

A câmera combina órbita, zoom orientado ao cursor e deslocamento lateral com bordas elásticas. Aponte e role para revelar o conteúdo; clique diretamente na imagem ou no bloco de título/resumo para abrir o case em HTML, sem uma seleção prévia. O núcleo do projeto e **Explorar carreira** continuam permitindo viajar até ele e explorar seus satélites; **Abrir case** também fica disponível nessa visão. Fechar o case retorna ao projeto; `Escape` e zoom para fora permitem voltar ao cluster e à visão geral. Use `H` ou o controle do HUD para centralizar a visão. No desktop, arraste para orbitar e use `Shift` + arraste ou o botão direito para mover.

**Explorar carreira** oferece acesso por teclado à mesma estrutura, inclusive com WebGL funcionando. No celular, a navegação guiada mantém o universo 3D; os satélites usam menos rótulos e uma órbita compacta, passando por trás da capa nas laterais. As palavras completam uma volta contínua em aproximadamente 32 segundos. A preferência por movimento reduzido mantém os satélites estáticos. A troca PT/EN preserva o contexto selecionado.

## Uma entidade, uma âncora, várias relações

As regiões ficam mais afastadas da identidade central, e os projetos usam ângulos distribuídos uniformemente com variação de profundidade para evitar agrupamentos acidentais.

Os quatro clusters primários são `key-projects`, `experience-impact`, `education-research` e `talks-community`. O campo `cluster` define a única âncora espacial de cada entidade. `relations` conecta essa entidade a outros contextos por ID:

```ts
cluster: "key-projects",
relations: [
  {targetId: "software-engineering", type: "thesis-of"},
  {targetId: "education-research", type: "research"},
],
```

Aitheron existe uma vez, mesmo quando acessado pela formação acadêmica. A experiência profissional referencia os projetos existentes da mesma forma. IDs de relações precisam resolver para uma entidade, cluster ou identidade; o schema rejeita referências ausentes e IDs duplicados.

`importance` aceita `flagship`, `primary` e `secondary`. `satellites` contém até sete sinais com `id`, `type`, `label: {pt, en}` e importância opcional. Eles apresentam contexto e não são botões de navegação. Um único renderizador atende todos os projetos, com no máximo um micro-universo de projeto detalhado por vez. Os limites de capas continuam sendo 3/2/1 nos modos high/medium/low.

Eventos usam `participationRole`: `speaker`, `workshop-host`, `mentor`, `panelist` ou `attendee`. Os exemplos de facilitador e ouvinte têm pesos diferentes; a presença em um evento não implica uma palestra.

## Conteúdo provisório

O núcleo Marlon revela a imagem progressivamente usando o mesmo pipeline de fragmentação das capas. Clique no núcleo/nome ou use **Explorar carreira → Focar em Marlon** para aproximar; o resumo e as quatro ações aparecem perto do núcleo. `Escape`, zoom para fora e centralização retornam à visão geral. Os satélites semânticos permanecem ambientais desde a entrada.

Configure `image: {src, alt: {pt, en}}` em `src/content/identity.ts` para substituir o placeholder procedural por uma foto. Em `actions`, configure `href` com HTTPS para LinkedIn/GitHub, `mailto:ENDERECO?subject=Contact%20from%20Marlon%27s%20Portfolio` para Email, ou um caminho interno (PDF/página) ou HTTPS para Currículo. URLs HTTPS abrem em outra aba por padrão, com `noopener noreferrer`; `external: false` permite abrir na mesma aba. Sem destino válido, a ação mostra **Em breve / Coming soon** e fica desabilitada. Nenhum contato, foto ou currículo fictício é fornecido.

Os cinco nomes de projetos são reais; os textos, sinais e capas desta etapa são provisórios. `provisional` identifica cases ainda em construção. As métricas fornecidas para o protótipo permanecem no contexto do projeto e são identificadas como provisórias no case. Não foram inventados empregadores, instituições, URLs ou resultados adicionais.

O modelo aceita seções opcionais de problema, solução, papel, impacto, ano, tipo, status, empresa, galeria e links HTTPS, incluindo documentos. Seções ausentes ficam ocultas. `image.category` e as imagens da galeria podem ser `project`, `conceptual` ou `event`. Use `confidential` quando aplicável e identifique imagens conceituais; uma capa procedural não é uma captura real do produto.

A V2 permanece estática e determinística. Não implementa busca semântica, embeddings, RAG, APIs de LLM ou ECHO.

## Como adicionar um item ao portfólio

1. Copie um arquivo existente da pasta do cluster correspondente em `src/content/nodes`.
2. Altere `id`, `slug` e todo o conteúdo localizado.
3. Escolha uma variante suportada: `data-node`, `genomic-nebula`, `agent-network`, `system-module` ou `human-signal`.
4. Defina o cluster primário, importância e apenas os campos de case disponíveis. Adicione relações por ID e poucos satélites significativos.
5. Importe o novo objeto em `src/content/nodes/index.ts` e adicione-o a `registeredNodes`.
6. Execute `npm test`, `npm run typecheck` e `npm run build` para validar comportamento, tipos, schema e relacionamentos.

O novo item será posicionado e renderizado automaticamente. Use `position: {mode: "manual", value: [x, y, z]}` apenas quando precisar de direção de arte específica.

## Verificação

```bash
npm test
npm run typecheck
npm run build
```

Os testes usam TypeScript e `node:test`, sem framework adicional. Cobrem o grafo, a validação, as transições de navegação, os satélites e as interações existentes. A verificação no navegador deve incluir a jornada Marlon → Projetos-chave → Aitheron → case → cluster → visão geral, PT/EN, teclado, toque, movimento reduzido e fallback WebGL. Consulte o [plano e registro de execução](docs/plans/v2-career-knowledge-graph.md).

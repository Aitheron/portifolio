# Vector Space — Portfolio Template

Projeto open source sob a [licença MIT](LICENSE). Você pode usar, modificar e distribuir o template, inclusive comercialmente, preservando os avisos de copyright e da licença. As dependências mantêm suas respectivas licenças.

Template de portfólio espacial com identidade genérica, um projeto demonstrativo e uma experiência conectada. Os quatro clusters estão disponíveis; formação e comunidade começam vazios. Usa Next.js, React, TypeScript, Three.js, React Three Fiber, Drei, next-intl, Zustand e Zod. A arquitetura separa conteúdo JSON do motor visual, preservando a experiência V2.

## Instalação e verificação

Requer Node.js 20.9+ e npm.

```bash
npm install
npm run dev
# http://localhost:3000/pt ou /en
npm test
npm run typecheck
npm run build
npm start
```

## Personalização

Normalmente, altere apenas `src/content/`, `public/assets/` e `portfolio.config.ts`.

- **Identidade:** edite `src/content/profile.json`: nome, funções, resumo, introdução, metadados, imagem opcional, `signals` e ações. Contatos sem destino ficam desabilitados. Currículos podem usar `href` por idioma; um idioma sem PDF permanece desabilitado, sem baixar outro idioma por engano.
- **Projeto:** copie `src/content/projects/example-project.json` para `src/content/projects/<id>.json`. Defina `id` e `slug` únicos, `cluster`, textos e evidências. Importe o JSON em **`src/content/registry.ts`** e adicione `{file, data}` à lista. Este é o único registro extra; a ordem da lista preserva o posicionamento determinístico. O projeto de exemplo já está registrado; use um novo ID ao duplicá-lo.
- **Experiência, formação e eventos:** use as pastas `experience/`, `education/` e `talks/`, com `kind` correspondente. Campos de projeto são opcionais. Eventos podem informar `participationRole` (`speaker`, `workshop-host`, `mentor`, `panelist`, `attendee`).
- **Assets:** coloque arquivos em `public/assets/projects/<id>/` e referencie `/assets/projects/<id>/arquivo.svg`. Os SVGs do exemplo foram criados para este repositório. Arquivos pessoais fora de `public/assets/` continuam ignorados pelo Git.
- **Capa e galeria:** `coverImage: {src, alt?, caption?, role?}` define uma capa. `gallery` aceita zero ou várias imagens, sem limite de um item. Sem capa, o fallback procedural existente permanece. Referências locais em `/assets/` precisam existir; o servidor/build informa arquivo e campo quando faltam.
- **Imagem no case:** adicione `{type: "image", src, alt, caption, presentation: {size: "wide", align: "center"}}` em `content`, entre os blocos de texto desejados. `size` aceita `inline`, `wide`, `full`; `align` aceita `left`, `center`, `right`. Não há coordenadas absolutas no conteúdo editorial.
- **Blocos:** `content` mantém a ordem de `text`, `image`, `gallery`, `metric` e `link`. O exemplo ativo demonstra texto, imagem, métrica e link; a galeria do projeto usa `gallery[]`. Para inserir uma galeria em outro ponto do texto, use `{type: "gallery", images: [...]}` em `content` e remova as mesmas imagens da galeria final para evitar repetição. `gallery` usa `images`; `metric` usa `value`, `label` e `description` opcional; `link` aceita HTTPS. O hero, os metadados, **Contexto do projeto** e **Contexto conectado** continuam no shell fixo, antes do conteúdo editorial.
- **Sinal de órbita/contexto:** registre uma vez em `signals`: `{id, type, label, showInOrbit, showInCase, importance?}`. Tipos: `concept`, `technology`, `domain`, `metric`. As duas visibilidades são `true` por padrão; os limites visuais existentes decidem quantos sinais orbitam. Não duplique esses rótulos em coleções paralelas de tags.
- **Conexão semântica:** use `relations: [{targetId, type, label?}]`. O mesmo dado alimenta o grafo e os botões de contexto conectado. Tipos: `built-at`, `uses`, `related-to`, `produced`, `thesis-of`, `impact`, `presented-at`, `research`. Referências ausentes, autorrelações e relações idênticas duplicadas são erros.
- **Clusters:** edite `src/content/clusters.json`; IDs, títulos, cores, padrões e âncoras são dados. Cada entidade possui um único `cluster`; relações não criam cópias espaciais. Preserve espaço suficiente entre regiões ao mudar suas âncoras.
- **Idiomas:** configure `locales`, `defaultLocale` e, opcionalmente, `localeLabels` em `portfolio.config.ts`. Pode usar `["es"]` ou `["en", "es", "de"]`. Os textos localizados usam `{idioma: "Texto"}` e exigem o idioma padrão. Traduções opcionais ausentes usam o padrão. Edite a interface em `src/content/messages/<idioma>.json`: o arquivo padrão é obrigatório; arquivos ou chaves opcionais ausentes usam esse arquivo. Para trocar o padrão, traduza primeiro os campos de conteúdo e o catálogo correspondente. Não é necessário editar renderizadores ou criar páginas por idioma.

Todo documento principal usa `schemaVersion: 1`. Versões desconhecidas, blocos não suportados, URLs inseguras e objetos localizados malformados falham antes de chegar ao WebGL. Os erros identificam o arquivo e o campo.

## Arquitetura

```text
src/content/*.json + registry.ts
                ↓ Zod + validação de referências
        entidades e grafo tipados
                ↓
   universo 3D + shell do case + CaseContentRenderer
```

O registro explícito mantém a aplicação compatível com seu bundle estático e evita filesystem no cliente. `src/content/identity.ts`, `clusters.ts` e `nodes/index.ts` são adaptadores; publicação normal de conteúdo não exige modificá-los. O filesystem é usado somente no servidor para catálogos de idioma e validação de assets. Configuração controla idiomas, marca do motor e versão; biografia e projetos ficam no conteúdo.

As capas continuam sendo reconstruídas por fragmentos nos modos high/medium; low usa dissolve. A câmera preserva órbita, zoom orientado ao cursor e bordas elásticas. Clique na capa/resumo para abrir o case, ou use **Explorar carreira** para navegar por teclado. Fechar retorna ao projeto; `Escape` e zoom para fora retornam ao cluster e à visão geral. `H` centraliza. A troca de idioma preserva o contexto. O modo móvel, movimento reduzido e fallback WebGL permanecem disponíveis.

Todo o conteúdo distribuído é genérico. Contatos começam sem destino e nenhum currículo pessoal é disponibilizado. O projeto de exemplo usa imagens locais e uma métrica explicitamente fictícia; substitua-os por evidências do seu trabalho. Experiência e projeto se referenciam, demonstrando o contexto conectado. Formação e comunidade mostram seus estados vazios. O template não adiciona CMS externo, banco de dados, autenticação ou IA.

Os testes cobrem navegação, grafo, sinais, schemas, idiomas configuráveis, galerias e assets. Verifique também identidade → projeto → case → cluster → visão geral, PT/EN, teclado e tamanhos móveis no navegador.

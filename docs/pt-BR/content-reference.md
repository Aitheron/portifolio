# Referência de conteúdo

[English](../en/content-reference.md) | [Português](./content-reference.md) · [Voltar ao início](../../README.pt-BR.md)

Use esta página para consultar o contrato de conteúdo depois de seguir [Monte seu portfólio](build-your-portfolio.md). A implementação de referência está em [portfolio-schema.ts](../../src/lib/portfolio-schema.ts), com os tipos compartilhados em [portfolio-types.ts](../../src/lib/portfolio-types.ts).

## Regras compartilhadas

- O conteúdo usa JSON com `schemaVersion: 1`. O motor atual aceita apenas a versão 1; alterar o número não migra o conteúdo.
- Os objetos do schema rejeitam campos desconhecidos. Um campo não suportado é erro, não um ponto de extensão.
- IDs e slugs usam letras minúsculas, números e hífens simples como separadores, por exemplo `community-map`. IDs de entidades devem ser únicos entre perfil, clusters e itens registrados. Slugs dos itens também precisam ser únicos.
- Um texto traduzido é um objeto como `{"pt": "Projeto", "en": "Project"}`. O idioma padrão configurado é obrigatório. Outras traduções ausentes usam o idioma padrão. Uma tradução fornecida não pode estar em branco.
- Campos opcionais podem ser omitidos. Não substitua uma imagem ausente por um objeto vazio nem uma tradução ausente por uma string vazia.
- O conteúdo textual é texto simples, não Markdown ou HTML executável.

## Idiomas e configuração

[portfolio.config.ts](../../portfolio.config.ts) concentra a configuração compartilhada:

| Campo | Significado |
|---|---|
| `defaultLocale` | Idioma padrão do aplicativo; precisa estar em `locales`. O template usa `pt`. |
| `locales` | Lista não vazia de identificadores de idioma válidos e únicos. O template usa `pt` e `en`. |
| `localeLabels` | Rótulos do seletor por idioma: `label`, `code` e `languageTag` opcional. Uma entrada ausente usa o identificador do idioma. |
| `branding.spaceName` | Nome do espaço usado na interface. |
| `contentSchemaVersion` | Versão suportada do conteúdo, atualmente `1`. |

A documentação usa a pasta `pt-BR`; o aplicativo do template usa o identificador `pt`. Esses nomes têm finalidades diferentes. Deixar o README em inglês não altera o idioma padrão do aplicativo.

Para adicionar um idioma, por exemplo espanhol:

1. Adicione `"es"` a `locales` e uma entrada `es` a `localeLabels`.
2. Adicione traduções `es` aos campos de conteúdo desejados. Traduções ausentes usam `defaultLocale`.
3. Copie o arquivo de mensagens do idioma padrão para `src/content/messages/es.json` e traduza seus valores, mantendo as mesmas chaves.
4. Configure o destino de currículo específico desse idioma, caso queira habilitá-lo.
5. Reinicie o desenvolvimento, abra `/es` e rode `npm run build`.

As mensagens da interface são carregadas de `src/content/messages/<locale>.json`. Arquivos de idiomas opcionais ausentes ou chaves ausentes usam as mensagens do idioma padrão. JSON inválido, strings vazias e tipos de valor inválidos falham na validação. Traduza as chaves existentes do idioma padrão; chaves extras em um idioma opcional não ampliam a estrutura padrão.

Antes de trocar `defaultLocale`, garanta que todo campo de conteúdo traduzido tenha um valor no novo idioma padrão e que o arquivo de mensagens desse idioma exista. Antes de remover uma língua, confira destinos de contato e links para suas rotas. Testes podem conter expectativas sobre o idioma do template que precisam ser atualizadas no fork personalizado.

## Perfil

[profile.json](../../src/content/profile.json) define a identidade central e a tela de entrada. Os campos são obrigatórios, exceto quando marcados como opcionais:

| Campo | Formato / finalidade |
|---|---|
| `schemaVersion`, `id` | Versão `1` e ID único da entidade. |
| `title` | Nome completo traduzido; também fornece o nome da introdução. |
| `shortName` | String não vazia para exibição compacta da identidade. |
| `primaryRole`, `secondaryRole`, `summary` | Textos traduzidos da identidade. |
| `intro` | `eyebrow`, `role`, `statement` e `status`, todos traduzidos. |
| `metadata` | `title` e `description` traduzidos para metadados da página. |
| `position` | Tupla numérica `[x, y, z]`; o template usa `[0, 0, 0]`. |
| `visual` | Configuração visual descrita abaixo. |
| `signals` | Array de sinais semânticos; pode estar vazio. |
| `actions` | Array de ações de contato; pode estar vazio. |
| `image` | Objeto de mídia opcional. O perfil usa `image`, não `coverImage`. |

### Ações de contato

Toda ação exige `id`, `type` e `label` traduzido. Os tipos disponíveis são `linkedin`, `github`, `email` e `resume`.

| Campo opcional | Comportamento |
|---|---|
| `href` | String de destino ou objeto que associa idiomas a destinos. Strings vazias são permitidas para destinos não configurados. |
| `external` | Solicita navegação externa quando aplicável. |
| `email` | Endereço válido para uma ação de e-mail; o resolvedor monta o link `mailto:`. |
| `subject` | String com o assunto do e-mail. |
| `download` | Nome sugerido para o arquivo de currículo. O navegador pode tratar downloads de formas diferentes; currículos da mesma origem usam esse atributo. |

LinkedIn e GitHub precisam de URLs HTTPS. Currículos aceitam caminhos locais ou URLs HTTPS. Destinos ausentes geram ações desabilitadas. Um `href` por idioma **não tem fallback entre línguas**: o currículo em inglês não vira silenciosamente um download em português. Use uma string única se o mesmo arquivo atender a todos os idiomas.

## Itens (nós)

Todo item registrado segue o mesmo schema, independentemente da pasta. Veja o [exemplo mínimo completo](build-your-portfolio.md#7-adicione-outro-item).

| Campo obrigatório | Valor aceito |
|---|---|
| `schemaVersion` | `1` |
| `id`, `slug` | Identificadores únicos conforme as regras compartilhadas. Um slug não cria uma rota separada de case. |
| `kind` | `project`, `experience`, `talk`, `mentoring` ou `education` |
| `cluster` | ID de cluster existente |
| `title`, `summary`, `description` | Textos traduzidos |
| `visual` | Configuração visual |
| `position` | `{"mode": "auto"}` ou `{"mode": "manual", "value": [1, 2, 3]}` |

| Campo opcional | Valor aceito / comportamento |
|---|---|
| `importance` | `flagship`, `primary` ou `secondary`; padrão `primary`. Influencia layout e destaque na cena. |
| `participationRole` | `speaker`, `workshop-host`, `mentor`, `panelist` ou `attendee` |
| `provisional`, `confidential` | Metadados editoriais booleanos. `confidential` não oferece controle de acesso; não guarde material privado no conteúdo público. |
| `year`, `company` | Strings não vazias; use `"2025"`, não o número `2025`. |
| `status`, `projectType` | Textos traduzidos |
| `coverImage` | Objeto de mídia opcional para a capa do projeto/case |
| `gallery` | Array de objetos de mídia, exibido depois do conteúdo editorial ordenado |
| `content` | Array ordenado de blocos editoriais |
| `signals` | Array de sinais semânticos; padrão `[]` |
| `relations` | Array de conexões direcionadas; padrão `[]` |
| `technologies` | Array de strings não vazias; padrão `[]`. Esses metadados de tecnologias são distintos dos sinais semânticos tipados. |
| `problem`, `solution`, `myRole`, `impact` | Seções legadas opcionais e traduzidas; exibidas antes de `content` |
| `links` | Array com `label` traduzido e `type`: `website`, `github`, `article`, `video` ou `document`. Links comuns exigem `href` HTTPS; documentos também aceitam arquivos locais e destinos por idioma (veja abaixo). |

Criar outro `kind` exige mudanças nos tipos, na validação e na renderização. Para personalização comum, use os tipos existentes. Os nós só são carregados quando importados e adicionados a [registry.ts](../../src/content/registry.ts).

## Mídia

Objetos de mídia são compartilhados entre imagens de perfil, capas, galerias e blocos de imagem.

| Campo | Significado |
|---|---|
| `src` | Caminho de URL local ou URL HTTPS sem credenciais embutidas; obrigatório |
| `alt` | Texto alternativo traduzido opcional; forneça-o para imagens relevantes |
| `caption` | Legenda visível traduzida opcional |
| `role` | `cover`, `interface`, `architecture`, `result`, `research`, `concept`, `event` ou `gallery`; opcional |
| `category` | Metadado opcional: `project`, `conceptual` ou `event` |

URLs locais começam com uma única `/`, não contêm espaços, query strings, fragmentos ou barras invertidas e não podem subir diretórios com `..`. Prefira `/assets/...`, que corresponde a `public/assets/...`.

O servidor valida a existência dos arquivos referenciados em `/assets/` e verifica se permanecem dentro de `public/`. Documentos (`type: "document"`) têm todos os caminhos locais verificados, inclusive fora de `/assets/`, em cada idioma cadastrado; o destino precisa ser um arquivo dentro de `public/`. Outros tipos não têm todos os prefixos locais verificados. URLs remotas não são verificadas previamente. Disponibilidade HTTPS, permissões entre origens e decodificação de texturas dependem da execução no navegador.

Uma capa omitida usa o visual procedural. Um arquivo referenciado em `/assets/` que não existe falha na validação. Uma capa remota que não carrega pode usar o fallback em execução. `role` e `category` descrevem a mídia; não escolhem coordenadas da cena.

## Blocos editoriais

`content` é renderizado na ordem do array. Os exemplos abaixo são **blocos individuais** para inserir nesse array. Arquivos de imagem referenciados precisam ser adicionados antes do uso.

### Texto

```json
{
  "type": "text",
  "title": {"pt": "Decisões", "en": "Decisions"},
  "body": {"pt": "Explique uma decisão e seu motivo.", "en": "Explain a decision and its reason."}
}
```

`body` é obrigatório; `title` é opcional. Use `\n` dentro de uma string JSON para inserir uma quebra de linha.

### Imagem

```json
{
  "type": "image",
  "src": "/assets/projects/example-project/architecture.svg",
  "alt": {"pt": "Diagrama demonstrativo", "en": "Demonstration diagram"},
  "presentation": {"size": "wide", "align": "center"}
}
```

Todos os campos de mídia são aceitos. `presentation.size` é opcional e aceita `inline`, `wide` ou `full`; `presentation.align` é opcional e aceita `left`, `center` ou `right`. Eles afetam a imagem dentro do layout existente do case, não a grade da página inteira.

### Galeria

```json
{
  "type": "gallery",
  "images": [
    {
      "src": "/assets/projects/example-project/interface.svg",
      "alt": {"pt": "Interface demonstrativa", "en": "Demonstration interface"}
    }
  ]
}
```

Um bloco de galeria exige ao menos uma imagem. Use-o para posicionar a galeria em um ponto específico da narrativa; use `gallery` no nível do nó para imagens depois de `content`. Colocar as mesmas imagens nos dois lugares as exibe duas vezes.

### Métrica

```json
{
  "type": "metric",
  "value": "42%",
  "label": {"pt": "Métrica fictícia", "en": "Fictional metric"},
  "description": {"pt": "Exemplo de formato; substitua por um resultado verificado.", "en": "Format example; replace with a verified result."}
}
```

`value` é uma string não vazia, `label` é traduzido e obrigatório e `description` é opcional. Um bloco de métrica não referencia um sinal por `signalId`. Um sinal do tipo `metric` continua sendo um rótulo semântico; o bloco carrega o resultado exibido.

### Link

```json
{
  "type": "link",
  "label": {"pt": "Ver demonstração", "en": "View demonstration"},
  "href": "https://example.com"
}
```

`label` e `href` HTTPS são obrigatórios. Esse bloco não aceita o metadado `type: "website"` de `links` no nível do nó; aqui `type` é sempre `"link"`.

### Documentos locais e por idioma

Use `type: "document"` em `links` para a posição padrão, ou dentro de `content` para escolher a posição do documento na narrativa:

```json
{
  "type": "document",
  "label": {"pt": "Resumo do projeto", "en": "Project overview"},
  "href": {
    "pt": "/assets/projects/example-project/overview.pt.txt",
    "en": "/assets/projects/example-project/overview.en.txt"
  }
}
```

Os arquivos desse exemplo ficam em `public/assets/projects/example-project/`. O caminho público começa com `/`, sem o prefixo `public`. Documentos podem ser PDFs, textos ou outros arquivos; não há restrição por extensão. Cada destino aceita um caminho local ou HTTPS. Use uma string em `href` se o mesmo arquivo atender a todos os idiomas. Para disponibilizar só em inglês, informe apenas `en`; se faltar o destino do idioma atual, o documento é omitido, sem fallback para outra língua e sem seção vazia.

Arquivos locais são oferecidos para download; documentos HTTPS abrem em outra aba. Não cadastre o mesmo item em `content` e `links` a menos que queira exibi-lo duas vezes. `content` preserva a ordem dos blocos, inclusive `link` e `document`: para criar “Como acessar o projeto”, coloque um bloco de texto com esse título seguido do link na posição desejada.

### Ordem de exibição do case

O case mostra título, resumo, descrição e capa disponível. Sua área de evidências exibe, quando presentes: metadados, aviso provisório, tecnologias e sinais; seções legadas `problem`/`solution`/`myRole`/`impact`; `content` na ordem definida; e `gallery` do nó. Depois vêm os links comuns de `links`, os documentos de `links` e, por último, o **Contexto conectado** (`relations`). A ordem de cadastro é preservada dentro de cada grupo. Links e documentos posicionados em `content` permanecem onde foram colocados. Seções opcionais ausentes são omitidas. Evite repetir a mesma história em campos legados e blocos de texto.

## Sinais semânticos

Cada sinal exige `id`, `type` (`technology`, `concept`, `metric` ou `domain`) e `label` traduzido.

| Campo opcional | Significado |
|---|---|
| `showInOrbit` | Elegível para os satélites da cena, exceto quando explicitamente `false` |
| `showInCase` | Incluído no contexto do case, exceto quando explicitamente `false` |
| `importance` | Número de `0` a `1`; valores maiores vêm primeiro na órbita e valores omitidos usam `0.5` |
| `visualWeight` | Número de `0` a `2`; metadado aceito, ainda não consumido pelo renderizador |
| `relationTargetId` | ID de entidade existente; validado, mas não cria satélite clicável nem substitui uma relação |

IDs de sinais precisam ser únicos dentro do perfil ou nó que os contém. Na órbita, sinais de mesma prioridade usam o ID como desempate para manter uma ordem estável; no case, os sinais mantêm a ordem do arquivo. Qualidade da cena e tamanho da tela limitam os satélites visíveis; a lista elegível do case é separada desse limite visual. A `importance` do sinal é numérica e difere dos níveis nomeados de importância do nó.

## Relações

Uma relação exige `targetId` e `type`; um `label` traduzido opcional substitui o rótulo de exibição. Tipos suportados:

| Tipo | Uso típico |
|---|---|
| `built-at` | Projeto → experiência em que foi desenvolvido |
| `produced` | Experiência → projeto que produziu |
| `uses` | Item → entidade relacionada que utiliza |
| `related-to` | Conexão geral de contexto |
| `thesis-of` | Pesquisa ou tese → contexto de formação |
| `impact` | Item → contexto relacionado de impacto |
| `presented-at` | Projeto → item de palestra ou evento |
| `research` | Item → contexto de pesquisa |

Esses são significados editoriais, não restrições impostas aos tipos de origem e destino. O destino precisa ser um ID existente de nó, cluster ou identidade. Autorrelacionamentos e pares repetidos de `type` + `targetId` no mesmo nó são rejeitados. Conexões inversas não são criadas automaticamente.

## Clusters e visuais

[clusters.json](../../src/content/clusters.json) contém `schemaVersion: 1` e um array `clusters` não vazio. Cada cluster exige:

| Campo | Valor aceito |
|---|---|
| `id` | ID único da entidade |
| `title`, `description` | Textos traduzidos |
| `position` | Tupla numérica `[x, y, z]` |
| `radius` | Número positivo |
| `color`, `secondaryColor` | Cor hexadecimal de seis dígitos, como `#5ad7ff` |
| `pattern` | `streams`, `helix`, `network`, `topology` ou `pulse` |

Os IDs do template são `key-projects`, `experience-impact`, `education-research` e `talks-community`. Clusters vazios são válidos. Remover ou renomear um deles exige atualizar todos os nós e relações que o referenciam.

Objetos `visual` de perfil e nó exigem uma `variant`: `data-node`, `genomic-nebula`, `agent-network`, `system-module` ou `human-signal`. `size` é opcional, maior que `0` e no máximo `3`; `intensity` é opcional e vai de `0` a `2`.

`position.mode: "auto"` deixa o layout posicionar os itens ao redor do cluster. O modo manual usa uma tupla explícita de coordenadas. Mantenha o posicionamento automático até precisar ajustar a cena e poder conferir a navegação em desktop e celular.

---

[Anterior: Monte seu portfólio](build-your-portfolio.md) · [Próximo: Arquitetura](architecture.md)

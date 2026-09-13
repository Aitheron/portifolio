# Monte seu portfólio

[English](../en/build-your-portfolio.md) | [Português](./build-your-portfolio.md) · [Voltar ao início](../../README.pt-BR.md)

Este tutorial leva você do exemplo genérico a um portfólio com sua identidade, um primeiro case e outro projeto. Comece com a [instalação local funcionando](getting-started.md). Mantenha `npm run dev` aberto e abra o repositório no editor.

Você vai editar JSON, adicionar arquivos de mídia e fazer uma pequena alteração no registro de conteúdo. JSON usa aspas duplas e não aceita comentários nem vírgulas finais. Os exemplos usam os dois idiomas atuais do app: `pt` e `en`.

## 1. Conheça os arquivos que vai editar

| Arquivo ou pasta | O que você altera |
|---|---|
| `src/content/profile.json` | Nome, introdução, biografia, metadados e contatos |
| `src/content/projects/example-project.json` | Seu primeiro projeto e seu case |
| `src/content/experience/example-experience.json` | Uma experiência conectada ao projeto |
| `src/content/clusters.json` | Nomes e descrições das quatro regiões de carreira |
| `src/content/registry.ts` | Quais arquivos de projetos, experiências e outros itens são carregados |
| `src/content/messages/pt.json` e `en.json` | Textos da interface, como botões e navegação |
| `portfolio.config.ts` | Idiomas do app e nome do espaço |
| `public/assets/` | Imagens públicas e arquivos de currículo |

Comece editando os exemplos existentes. Mantenha os nomes dos arquivos, `id`, `slug`, `cluster` e os destinos das relações na primeira etapa. Assim, as conexões continuam válidas enquanto você aprende o formato. O nome da pasta, sozinho, não registra conteúdo.

## 2. Substitua a identidade

Abra `src/content/profile.json`. Substitua estes campos **dentro do objeto existente**, mantendo suas outras propriedades obrigatórias:

```json
{
  "title": {"pt": "Alex Silva", "en": "Alex Silva"},
  "shortName": "Alex",
  "primaryRole": {"pt": "Desenvolvimento de software", "en": "Software development"},
  "secondaryRole": {"pt": "Interfaces e acessibilidade", "en": "Interfaces and accessibility"},
  "summary": {
    "pt": "Crio ferramentas para tornar tarefas do dia a dia mais simples.",
    "en": "I build tools that make everyday tasks simpler."
  }
}
```

Alex é um exemplo fictício; use suas informações. Atualize também os quatro campos dentro de `intro`: `eyebrow`, `role`, `statement` e `status`. Eles controlam a tela de entrada. O nome em destaque na introdução vem de `title`.

Atualize `metadata.title` e `metadata.description`. Esses campos descrevem seu portfólio nos metadados da página e são separados da introdução visível. Mantenha `position` e `visual` como estão por enquanto.

**Confira:** recarregue a página para ver a introdução, entre no espaço e selecione a identidade central. O nome e a biografia devem refletir suas alterações. Confira `/pt` e `/en`.

## 3. Configure contatos e downloads de currículo

O template vem sem destinos de contato de propósito. Substitua o array `actions` pelo exemplo abaixo e troque as URLs e o e-mail pelos seus destinos reais:

```json
[
  {
    "id": "linkedin", "type": "linkedin",
    "label": {"pt": "LinkedIn", "en": "LinkedIn"},
    "href": "https://www.linkedin.com/in/your-handle/", "external": true
  },
  {
    "id": "github", "type": "github",
    "label": {"pt": "GitHub", "en": "GitHub"},
    "href": "https://github.com/your-handle", "external": true
  },
  {
    "id": "email", "type": "email",
    "label": {"pt": "E-mail", "en": "Email"},
    "email": "hello@example.com", "subject": "Hello from your portfolio"
  },
  {
    "id": "resume", "type": "resume",
    "label": {"pt": "Currículo", "en": "Resume"},
    "href": {"pt": "/assets/resume/resume-pt.pdf", "en": "/assets/resume/resume-en.pdf"},
    "download": "alex-silva-resume.pdf"
  }
]
```

Crie `public/assets/resume/` e coloque os PDFs nessa pasta **antes de salvar esses caminhos locais**. O caminho `/assets/resume/resume-en.pdf` corresponde a `public/assets/resume/resume-en.pdf`; não inclua `public` na URL. Tudo nessa pasta é público.

Se tiver um currículo para todos os idiomas, use uma string única em `href` em vez de um objeto. Se ainda não tiver currículo, remova essa ação ou mantenha-a sem `href`. A ausência de destino desabilita a ação. Downloads por idioma não usam o destino de outra língua como fallback. E-mail usa o campo `email`, não uma URL `mailto:` em `href`.

**Confira:** selecione a identidade e teste cada ação configurada. Abra cada URL de currículo diretamente para confirmar que ela serve o PDF correto.

## 4. Transforme o projeto de exemplo no seu primeiro case

Edite `src/content/projects/example-project.json`. Atualize `title`, `summary` e `description` nos dois idiomas. Use o resumo para uma apresentação curta e a descrição para dar contexto. Substitua `projectType` e `status` se quiser mantê-los; campos opcionais podem ser removidos.

O exemplo contém textos fictícios, uma métrica demonstrativa de `42%` e um link para `https://example.com`. Substitua ou remova todos eles. Inclua apenas resultados que você consiga comprovar.

O array `content` define a narrativa ordenada do case. Para começar com duas seções, substitua esse array por:

```json
[
  {
    "type": "text",
    "title": {"pt": "O problema", "en": "The problem"},
    "body": {
      "pt": "Descreva quem precisava de ajuda e qual dificuldade enfrentava.",
      "en": "Describe who needed help and the difficulty they faced."
    }
  },
  {
    "type": "text",
    "title": {"pt": "Minha contribuição", "en": "My contribution"},
    "body": {
      "pt": "Explique suas decisões, sua participação e o que aprendeu.",
      "en": "Explain your decisions, your contribution and what you learned."
    }
  }
]
```

Esses textos orientam a escrita; substitua-os antes de compartilhar. O conteúdo é exibido como texto simples: sintaxe Markdown não cria títulos ou links. Use os tipos de bloco para estruturar o case.

A `gallery` existente é separada de `content`. Substitua pelas suas imagens ou use `"gallery": []` quando não quiser mais as duas imagens de exemplo. Mantenha o campo vazio neste primeiro tutorial: um teste acessa `example.gallery` diretamente, então excluir a propriedade pode falhar no TypeScript mesmo que o schema permita sua omissão. A [referência](content-reference.md#blocos-editoriais) descreve os blocos de texto, imagem, galeria, métrica e link.

**Confira:** expanda a região de projetos, selecione seu projeto e abra o case. As seções devem aparecer na ordem do array, sem o resultado fictício anterior.

## 5. Adicione suas imagens

Crie uma pasta como `public/assets/projects/my-project/`. Coloque a capa e as capturas ou diagramas nela. Use nomes simples, por exemplo `cover.webp` e `architecture.png`. Publique imagens que você tenha permissão para usar e escreva textos alternativos úteis.

Substitua `coverImage` pelo exemplo abaixo depois de adicionar o arquivo:

```json
{
  "src": "/assets/projects/my-project/cover.webp",
  "alt": {"pt": "Tela principal do projeto", "en": "Project main screen"},
  "role": "cover"
}
```

Para colocar um diagrama entre seções de texto, insira um bloco de imagem em `content`:

```json
{
  "type": "image",
  "src": "/assets/projects/my-project/architecture.png",
  "alt": {"pt": "Fluxo entre interface, API e banco de dados", "en": "Flow between interface, API and database"},
  "caption": {"pt": "Visão geral da solução", "en": "Solution overview"},
  "role": "architecture",
  "presentation": {"size": "wide", "align": "center"}
}
```

A capa é opcional: remova `coverImage` se ainda não tiver uma e o motor usará um visual procedural. Um arquivo local referenciado em `/assets/` precisa existir; caminho quebrado é erro de validação. Imagens remotas HTTPS são aceitas, mas o servidor de origem pode impedir o uso delas como texturas WebGL.

Guarde mídias que serão commitadas em `public/assets/`: o `.gitignore` ignora outros conteúdos no primeiro nível de `public/`. Os quatro SVGs do template são exemplos que você pode substituir ou remover depois de eliminar suas referências no conteúdo.

## 6. Descreva habilidades e conecte sua experiência

Substitua `signals` do projeto por uma seleção pequena de tecnologias ou conceitos que realmente descrevam seu trabalho. Cada sinal tem um rótulo compartilhado pela órbita e pelo case:

```json
[
  {
    "id": "accessibility", "type": "concept",
    "label": {"pt": "Acessibilidade", "en": "Accessibility"},
    "showInOrbit": true, "showInCase": true, "importance": 0.9
  }
]
```

A cena limita os satélites visíveis conforme a capacidade do dispositivo. `showInOrbit: true` torna o sinal elegível; não garante que todos apareçam ao mesmo tempo.

Depois, edite título, resumo, descrição e conteúdo em `src/content/experience/example-experience.json`. Mantenha a conexão do exemplo apenas se o projeto pertencer a essa experiência. O projeto tem uma relação `built-at` com a experiência, e ela tem uma relação `produced` de volta. As relações são explícitas e direcionadas: uma não cria a outra automaticamente.

Se a conexão não fizer sentido, defina `relations` como `[]` nos dois arquivos. Para conectar outros itens depois, use o `id` exato deles, não o título, o nome do arquivo ou o slug. Veja [relações](content-reference.md#relações).

## 7. Adicione outro item

Crie `src/content/projects/community-map.json` com este **arquivo completo de projeto mínimo**:

```json
{
  "schemaVersion": 1,
  "id": "community-map",
  "slug": "community-map",
  "kind": "project",
  "cluster": "key-projects",
  "title": {"pt": "Mapa da comunidade", "en": "Community map"},
  "summary": {"pt": "Um mapa de espaços públicos.", "en": "A map of public spaces."},
  "description": {"pt": "Projeto demonstrativo para praticar a criação de conteúdo.", "en": "A demonstration project for practicing content creation."},
  "visual": {"variant": "data-node"},
  "position": {"mode": "auto"}
}
```

Substitua `src/content/registry.ts` pelo exemplo abaixo, que mantém os itens existentes e adiciona o novo:

```ts
import project from "./projects/example-project.json";
import experience from "./experience/example-experience.json";
import communityMap from "./projects/community-map.json";

export const contentEntries = [
  {file: "src/content/projects/example-project.json", data: project},
  {file: "src/content/experience/example-experience.json", data: experience},
  {file: "src/content/projects/community-map.json", data: communityMap},
];
```

O registro é explícito. Salvar um JSON sozinho não adiciona um nó. O campo `file` identifica o arquivo nas mensagens de validação; `data` deve apontar para o import correto. IDs e slugs precisam ser únicos. O posicionamento automático usa a ordem do registro, então reordenar os itens pode mudar suas posições.

Para outros tipos, siga o mesmo processo com `kind` definido como `experience`, `education`, `talk` ou `mentoring`, e escolha um ID de cluster existente. Você pode criar pastas em `src/content/` para organizar os arquivos; o registro continua decidindo o que é carregado. Consulte os campos na [referência de itens](content-reference.md#itens-nós).

**Confira:** o novo projeto deve aparecer na região de projetos e no explorador HTML. Seu case deve abrir mesmo sem imagens ou blocos editoriais.

## 8. Ajuste idiomas e nomes das regiões

Edite títulos e descrições traduzidos em `src/content/clusters.json` se quiser outros nomes para as regiões. Mantenha os IDs e os valores de layout inicialmente.

Em `portfolio.config.ts`, `branding.spaceName` controla o nome do espaço e `defaultLocale` controla o idioma padrão do app. Para usar inglês por padrão, troque `defaultLocale` de `"pt"` para `"en"`; os dois já estão em `locales`.

Para textos da interface, edite `src/content/messages/en.json` e `pt.json`. Para biografia e cases, edite os arquivos de conteúdo. São fontes de tradução diferentes. Reinicie o servidor de desenvolvimento depois de alterar a configuração de idiomas. Siga a [referência de idiomas](content-reference.md#idiomas-e-configuração) antes de adicionar ou remover uma língua.

## 9. Valide sua versão

Em outro terminal, na raiz do repositório:

```bash
npm run typecheck
npm run build
```

O build valida conteúdo registrado, referências e arquivos locais em `/assets/`. Corrija o arquivo e o campo indicados e rode novamente. Confira no navegador os dois idiomas, cada case, contatos configurados, descrições de imagem, navegação por teclado e uma tela estreita. Revise os textos em busca de nomes de exemplo, instruções de escrita e métricas fictícias restantes.

### Sobre os testes do template

`npm test` também verifica os dados exatos do exemplo em `src/lib/content-system.test.ts`: dois itens, IDs de exemplo, contatos sem destinos e blocos específicos, entre outras expectativas. A personalização pode mudar essas expectativas legitimamente mesmo com conteúdo válido. Trocar o idioma padrão também pode afetar testes que esperam `pt`.

No seu fork, atualize as expectativas específicas desses exemplos ou dê fixtures próprias a esses testes. Preserve os testes de validação, navegação, layout e segurança dos contatos. Não remova um teste que falhou sem entender o que ele verifica. Build e checagem de tipos são as verificações iniciais de conteúdo; não substituem testes de comportamento quando você altera o motor.

Se renomear ou excluir os arquivos de exemplo depois, atualize seus imports no registro e nos testes, além das relações que usam os IDs antigos. Imports quebrados nos testes também podem falhar na checagem de tipos do build de produção. Acessos diretos a campos do exemplo importado, como `example.gallery`, também podem falhar na checagem quando você remove esses campos; ajuste a fixture do teste nesse caso.

Ao concluir este tutorial, você terá um portfólio personalizado rodando localmente. [Publicar depois é opcional](getting-started.md#opcional-publicar-depois).

---

[Anterior: Primeiros passos](getting-started.md) · [Próximo: Referência de conteúdo](content-reference.md)

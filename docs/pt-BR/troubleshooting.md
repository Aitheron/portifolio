# Solução de problemas

[English](../en/troubleshooting.md) | [Português](./troubleshooting.md) · [Voltar ao início](../../README.pt-BR.md)

Mantenha o terminal de desenvolvimento visível: erros de conteúdo normalmente indicam o arquivo e o campo de origem. Se esta for sua primeira instalação, siga [Primeiros passos](getting-started.md) na ordem.

## Instalação e comandos

| Sintoma | O que fazer |
|---|---|
| `node` ou `npm` não é reconhecido | Instale o Node.js 24 LTS seguindo o [guia de instalação](getting-started.md), reabra o terminal e o editor. Confira `node --version` e `npm --version`. |
| Versão do Node antiga demais | Confira a versão no mesmo terminal que executa o npm. Outro terminal ou editor pode continuar usando uma instalação antiga. |
| npm não encontra `package.json` | Execute os comandos dentro do repositório clonado, onde está `package.json`. |
| Download de dependências falha | Leia o erro do npm para identificar problemas de rede/proxy ou registro, restaure a conexão e rode `npm install` novamente. Evite apagar o lockfile como primeira tentativa. |
| Porta 3000 ocupada | Abra a URL informada pelo Next.js ou rode `npm run dev -- --port 3001` e acesse a porta 3001. |
| `npm start` informa que não existe build de produção | Rode `npm run build` antes ou use `npm run dev` enquanto edita. |
| Produção ainda mostra conteúdo antigo | Faça um novo build e reinicie `npm start`. A produção não recompila automaticamente quando você edita JSON. |
| `npm test` falha em `rm` ou `for` no Windows | O script usa sintaxe de shell POSIX. Execute no WSL ou configure o npm para usar Git Bash, por exemplo `npm --script-shell="C:\Program Files\Git\bin\bash.exe" test` se o Git estiver instalado nesse local. |

## Conteúdo inválido

Um erro pode aparecer assim:

```text
[portfolio-content] Invalid content
src/content/projects/example-project.json: title.pt — Required default-locale translation
```

Abra o arquivo indicado, encontre o campo e corrija-o. Na configuração do template, todo objeto de texto traduzido precisa de um valor `pt` não vazio. Traduções opcionais podem ser omitidas, mas uma tradução explicitamente vazia é inválida.

Se o erro ocorrer antes da validação do schema, confira a sintaxe JSON: chaves e strings com aspas duplas, colchetes e chaves balanceados, sem comentários ou vírgulas finais. Campos desconhecidos são rejeitados; use a [referência](content-reference.md) em vez de inventar campos como `tags`, `signalId` ou `cover`.

| Erro de conteúdo | Correção provável |
|---|---|
| ID ou slug duplicado | Dê um ID único a cada entidade e um slug único a cada item; confira também os IDs do perfil e dos clusters. |
| Cluster inexistente | Use um ID atual de `src/content/clusters.json`. |
| Destino de relação inexistente | Aponte `targetId` ou `relationTargetId` para um ID de entidade existente e registre o nó de destino se necessário. |
| Autorrelacionamento ou relação duplicada | Remova a autorreferência ou o par repetido de `type` + `targetId`. |
| Versão de schema não suportada | Mantenha `schemaVersion` e `contentSchemaVersion` em `1` para este motor. |
| Ano ou valor de métrica inválido | Use strings como `"2025"` e `"42%"`, não números JSON. |

## Um novo item não aparece

Salvar um arquivo em `src/content/projects/` não basta. Importe-o em `src/content/registry.ts`, adicione-o uma vez a `contentEntries` e confirme que seu `cluster` é válido. A propriedade `data` precisa referenciar o novo import, não um exemplo existente por engano.

Expanda a região correspondente na cena ou no explorador HTML. Se o item aparecer no explorador, mas estiver difícil de ver na cena, use primeiro `position: {"mode": "auto"}` e tamanhos visuais normais. Coordenadas manuais podem deixar nós fora da área útil. A ordem do registro também afeta o posicionamento automático.

## Imagens ou currículos não carregam

A URL `/assets/projects/my-project/cover.webp` corresponde a `public/assets/projects/my-project/cover.webp`. Confira nome, extensão e letras maiúsculas/minúsculas; uma diferença pode funcionar em um filesystem e falhar em outro. Não inclua `public` na URL. Abra a URL diretamente no navegador.

O validador rejeita arquivos ausentes em `/assets/`, incluindo PDFs de currículo configurados. Adicione o arquivo ou remova a referência opcional. Mantenha os arquivos em `public/assets/` para que as regras de ignore permitam commitá-los.

Para imagens remotas, use HTTPS e confirme que o servidor permite acesso pelo navegador e carregamento de texturas entre origens. Uma imagem visível no case HTML ainda pode ser bloqueada como textura WebGL. Prefira uma cópia local que você possa publicar quando precisar de capas confiáveis.

Remover a capa opcional ativa um visual procedural; não oculta o nó. Imagens dos cases também têm um fallback visual quando o carregamento falha.

## Uma ação de contato está desabilitada

O template não tem destinos configurados. Edite a ação correspondente em `src/content/profile.json`:

- LinkedIn/GitHub: `href` HTTPS válido.
- E-mail: `email` válido, com `subject` opcional.
- Currículo: `href` local ou HTTPS; em um objeto por idioma, forneça o destino do idioma atual.

URLs de currículo por idioma não usam outra língua como fallback. Se um PDF servir para os dois idiomas, use uma string única em `href`. Confira o arquivo antes de investigar o comportamento de download do navegador.

## Idiomas mostram textos inesperados

Textos de conteúdo ficam no JSON de perfil ou item; botões e navegação ficam em `src/content/messages/<locale>.json`. Editar uma fonte não atualiza a outra.

Traduções opcionais ausentes usam `defaultLocale`. Para traduzir toda a interface, mantenha as chaves do catálogo padrão no outro catálogo e traduza os valores. Strings vazias e tipos incompatíveis são erros, não pedidos de fallback. Garanta que o arquivo de mensagens padrão exista, reinicie após mudanças de configuração e abra a rota explícita, como `/en`.

O idioma principal do README e a pasta `docs/pt-BR/` não configuram as rotas do app. O template usa `/pt`, não `/pt-BR`.

## Sinais, galerias ou cases parecem incorretos

`showInOrbit: true` torna um sinal elegível para a órbita, mas o limite visual do dispositivo pode restringir quantos aparecem. Confira `importance` e `showInCase` separadamente. `visualWeight` ainda não afeta a renderização. Use `relations` explícitas para botões de contexto conectado; `relationTargetId` sozinho não os cria.

Se imagens aparecerem duas vezes, confira se estão tanto em um bloco de galeria quanto em `gallery` no nível do nó. Se textos se repetirem, compare `content` com os campos legados `problem`, `solution`, `myRole` e `impact`. Os cases seguem a [ordem de exibição documentada](content-reference.md#ordem-de-exibição-do-case).

## A cena está lenta ou o WebGL está indisponível

Experimente o controle de movimento reduzido, feche abas que usam muita GPU e confira o suporte gráfico do navegador. O explorador HTML de carreira e o fallback de WebGL permitem acessar o mesmo conteúdo sem depender da seleção espacial. Imagens menores podem reduzir o custo de texturas e downloads.

Para retornar de uma visão aprofundada, use Escape por etapas ou o controle de início. No celular, use os controles guiados. Se o problema surgir depois de uma alteração de código, consulte o console do navegador e reproduza com o template original antes de mudar coordenadas do conteúdo para compensar.

## Testes falham depois da personalização

A suíte de conteúdo verifica os exemplos exatos do template, incluindo dois itens e contatos sem destinos. Um portfólio personalizado pode invalidar essas expectativas. Siga a [orientação sobre testes](build-your-portfolio.md#sobre-os-testes-do-template): atualize fixtures/expectativas específicas do conteúdo preservando a cobertura de validação e comportamento.

Excluir ou renomear JSONs de exemplo também exige atualizar imports nos testes, não apenas no registro. O TypeScript verifica esses imports durante o build da aplicação. Remover um campo acessado diretamente pelos testes, como `example.gallery`, também pode falhar na checagem de tipos. No tutorial inicial, mantenha `"gallery": []`; em uma limpeza mais ampla, ajuste a fixture do teste. Se testes de navegação, layout ou schema falharem, investigue possíveis regressões em vez de presumir que toda falha vem dos textos personalizados.

## Relatando um problema

Inclua o comando executado, a versão do Node, o sistema operacional, o navegador, o erro exato e os menores passos para reproduzi-lo. Para problemas de conteúdo, um JSON genérico mínimo e sua entrada no registro costumam bastar. Não inclua documentos privados ou credenciais nos relatos.

---

[Anterior: Arquitetura](architecture.md) · [Voltar ao início](../../README.pt-BR.md)

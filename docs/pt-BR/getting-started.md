# Primeiros passos

[English](../en/getting-started.md) | [Português](./getting-started.md) · [Voltar ao início](../../README.pt-BR.md)

Ao terminar este guia, o template original estará rodando no seu computador. Você precisa de um terminal, um editor de código e Git instalado. Não é necessário criar conta, banco de dados ou chave de API para rodar localmente.

## 1. Instale o Node.js e o npm

Use **Node.js 24 LTS** neste tutorial. O pacote declara mínimo de 20.9, mas isso não significa recomendar uma versão sem suporte. Consulte o [status das versões do Node.js](https://nodejs.org/en/about/previous-releases) ao escolher.

1. Acesse o [download oficial do Node.js](https://nodejs.org/en/download), selecione a versão 24 LTS e seu sistema operacional.
2. No Windows ou macOS, use o instalador oferecido para seu sistema e siga a instalação. No Linux, siga o método indicado para sua distribuição ou shell; se usar um gerenciador de versões, conclua sua configuração primeiro.
3. Reabra o terminal, inclusive o integrado ao editor. Verifique os dois comandos:

```bash
node --version
npm --version
```

A saída do Node deve começar com `v24.`. O npm exibe sua própria versão. Se um comando não for encontrado, consulte [problemas de instalação](troubleshooting.md#instalação-e-comandos).

## 2. Clone o repositório

Abra um terminal na pasta em que você costuma guardar seus projetos:

```bash
git clone https://github.com/Marlon-Souza16/portifolio.git my-portfolio
cd my-portfolio
```

`my-portfolio` é o nome da nova pasta local; você pode escolher outro. Abra essa pasta no editor. Na raiz, você deve encontrar `package.json`, `src/` e `portfolio.config.ts`.

Para ter um repositório pessoal, você pode criar um fork primeiro e clonar a URL HTTPS dele. Clonar este repositório, por si só, não cria outro na sua conta do GitHub. O GitHub explica a [diferença entre clone e fork](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-files-from-github).

## 3. Instale as dependências do projeto

Na pasta que contém `package.json`, execute:

```bash
npm install
```

Espere o comando terminar. Ele instala as dependências em `node_modules/`. Mantenha o `package-lock.json`, que registra as versões das dependências. Use npm de forma consistente com os comandos deste repositório.

Não é necessário criar um arquivo `.env` para o template padrão.

## 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Deixe esse terminal aberto. Acesse [http://localhost:3000/pt](http://localhost:3000/pt). O inglês está disponível em [http://localhost:3000/en](http://localhost:3000/en).

Se a porta 3000 estiver ocupada, use a URL exibida no terminal ou escolha outra porta:

```bash
npm run dev -- --port 3001
```

Use `Ctrl+C` no terminal do servidor para encerrá-lo.

## 5. Confira o template

1. Selecione **Entrar no Vector Space** e depois seu idioma.
2. Abra **Explorar carreira** na interface.
3. Expanda **Projetos-chave**, selecione **Projeto de exemplo**, aguarde a câmera chegar e selecione **Abrir case**.
4. Confira a capa, os sinais de contexto, a experiência conectada, o conteúdo editorial e as duas imagens da galeria.
5. Feche o case. `Escape` permite voltar do projeto ao cluster e à visão geral.

Você deve encontrar **Seu Nome**, um projeto e uma experiência. Formação e comunidade estão vazias de propósito. As quatro ações de contato ficam indisponíveis até serem configuradas. Se o 3D não funcionar, o mapa HTML ainda permite consultar o conteúdo.

Os atalhos de navegação estão em [Arquitetura](architecture.md#navegação-e-renderização).

## 6. Comece a personalizar

Continue em [Monte seu portfólio](build-your-portfolio.md). O guia começa pelo exemplo existente e depois mostra como adicionar um item. Não é necessário editar componentes React para alterações normais de conteúdo.

Após editar, confira o build de produção em um segundo terminal, na mesma pasta do projeto:

```bash
npm run typecheck
npm run build
```

Para visualizar esse build, encerre primeiro o servidor de desenvolvimento e execute:

```bash
npm start
```

`npm start` serve o último build. Execute `npm run build` novamente depois de alterar o conteúdo que você deseja visualizar em modo de produção.

## Opcional: publicar depois

Quando o portfólio funcionar localmente e o build passar, a Vercel é uma opção de hospedagem. Coloque sua versão personalizada em um repositório seu e siga o guia oficial de [Next.js na Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs). Este tutorial não exige publicação, domínio próprio ou conta de hospedagem.

Mantenha notas locais e arquivos ignorados fora do repositório publicado. Confira se as imagens e currículos que você pretende disponibilizar foram incluídos em `public/assets/`.

---

[Próximo: Monte seu portfólio →](build-your-portfolio.md)

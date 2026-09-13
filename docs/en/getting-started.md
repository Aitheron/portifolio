# Getting started

[English](./getting-started.md) | [Português](../pt-BR/getting-started.md) · [Back to home](../../README.md)

This guide ends with the unchanged starter running on your computer. You need a terminal, a code editor and Git installed. No account, database or API key is required to run it locally.

## 1. Install Node.js and npm

Use **Node.js 24 LTS** for this walkthrough. The package declares a minimum of 20.9, but that minimum is not a recommendation to install an unsupported release. Check the [Node.js release status](https://nodejs.org/en/about/previous-releases) when choosing a version.

1. Open the [official Node.js download page](https://nodejs.org/en/download), select version 24 LTS and your operating system.
2. On Windows or macOS, use the installer offered for your system and complete its installation steps. On Linux, follow the installation method shown for your distribution or shell; if using a version manager, complete its setup first.
3. Reopen your terminal, including any terminal inside your editor. Confirm both commands work:

```bash
node --version
npm --version
```

The Node output should begin with `v24.`. npm prints its own version number. If either command is missing, see [installation troubleshooting](troubleshooting.md#installation-and-commands).

## 2. Clone the repository

Open a terminal in the directory where you keep your projects:

```bash
git clone https://github.com/Marlon-Souza16/portifolio.git my-portfolio
cd my-portfolio
```

`my-portfolio` is the name of the new local folder; you can choose another name. Open that folder in your editor. You should see `package.json`, `src/` and `portfolio.config.ts` at its root.

For a personal repository, you can create a fork first and clone its HTTPS URL instead. Cloning this repository alone does not create a new repository in your GitHub account. GitHub explains the [difference between cloning and forking](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-files-from-github).

## 3. Install the project dependencies

From the folder containing `package.json`, run:

```bash
npm install
```

Wait until the command completes. This installs dependencies into `node_modules/`. Keep `package-lock.json`; it records dependency versions. Use npm consistently with the commands in this repository.

There is no `.env` file to create for the default template.

## 4. Start the development server

```bash
npm run dev
```

Keep that terminal running. Open [http://localhost:3000/en](http://localhost:3000/en). Portuguese is available at [http://localhost:3000/pt](http://localhost:3000/pt).

If port 3000 is occupied, use the URL printed by the server, or select a port explicitly:

```bash
npm run dev -- --port 3001
```

Use `Ctrl+C` in the server terminal to stop it.

## 5. Check the starter

1. Select **Enter Vector Space**, then your language.
2. Open **Explore career** in the interface.
3. Expand **Key Projects**, select **Example project**, wait for the camera to arrive and select **Open case**.
4. Inspect the cover, context signals, connected experience, editorial content and two gallery images.
5. Close the case. `Escape` returns outward through project, cluster and overview.

You should see **Your Name**, one project and one experience. Education and community intentionally have no entries. The four contact actions are intentionally unavailable until configured. If 3D cannot run, the HTML map still lets you inspect the content.

For navigation shortcuts, see [Architecture](architecture.md#navigation-and-rendering).

## 6. Start personalizing

Continue to [Build your portfolio](build-your-portfolio.md). It follows the existing example first, then shows how to add an entry. You do not need to edit React components for normal content changes.

After making changes, check a production build from a second terminal in the same project directory:

```bash
npm run typecheck
npm run build
```

To preview that build, stop the development server first, then run:

```bash
npm start
```

`npm start` serves the last build; run `npm run build` again after changing content that you want to preview in production mode.

## Optional: publish later

Once the portfolio works locally and the production build succeeds, Vercel is one deployment option. Put your customized version in a repository you control and follow the official [Next.js on Vercel guide](https://vercel.com/docs/frameworks/full-stack/nextjs). This walkthrough does not require deployment, a custom domain or a hosting account.

Keep your local notes and ignored files out of the published repository; confirm that images and resume files you intend to publish are included under `public/assets/`.

---

[Next: Build your portfolio →](build-your-portfolio.md)

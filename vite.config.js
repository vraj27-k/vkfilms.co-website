import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));
const publicRoot = join(projectRoot, "public");
const siteBase = process.env.GITHUB_ACTIONS === "true" ? "/vkfilms.co-website/" : "/";
const portfolioDirectories = [
  {
    key: "images",
    root: join(publicRoot, "images", "portfolio"),
    extensions: new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]),
  },
  {
    key: "videos",
    root: join(publicRoot, "videos", "portfolio"),
    extensions: new Set([".m4v", ".mov", ".mp4", ".webm"]),
  },
];
const portfolioModuleId = "\0virtual:portfolio-media";

function listCategoryFolders(root) {
  if (!existsSync(root)) return [];

  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function listPortfolioFiles(directory, category, extensions) {
  const categoryDirectory = join(directory, category);
  if (!existsSync(categoryDirectory)) return [];

  return readdirSync(categoryDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && extensions.has(entry.name.slice(entry.name.lastIndexOf(".")).toLowerCase()))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right))
    .map((fileName) => `${siteBase}${directory.slice(publicRoot.length + 1).split(sep).join("/")}/${category}/${encodeURIComponent(fileName)}`);
}

function getPortfolioMedia() {
  const categories = new Set(portfolioDirectories.flatMap(({ root }) => listCategoryFolders(root)));

  return Object.fromEntries(
    [...categories].map((category) => [
      category,
      Object.fromEntries(
        portfolioDirectories.map(({ key, root, extensions }) => [
          key,
          listPortfolioFiles(root, category, extensions),
        ]),
      ),
    ]),
  );
}

function portfolioMediaPlugin() {
  return {
    name: "portfolio-media",
    resolveId(id) {
      if (id === "virtual:portfolio-media") return portfolioModuleId;
    },
    load(id) {
      if (id === portfolioModuleId) {
        return `export default ${JSON.stringify(getPortfolioMedia())};`;
      }
    },
    configureServer(server) {
      const watchedRoots = portfolioDirectories.map(({ root }) => root);
      server.watcher.add(watchedRoots);

      const reloadPortfolio = (file) => {
        const absoluteFile = resolve(file);
        if (!watchedRoots.some((root) => absoluteFile.startsWith(`${root}${sep}`))) return;

        const module = server.moduleGraph.getModuleById(portfolioModuleId);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: "full-reload" });
      };

      server.watcher.on("add", reloadPortfolio);
      server.watcher.on("unlink", reloadPortfolio);
    },
  };
}

export default defineConfig({
  base: siteBase,
  plugins: [react(), portfolioMediaPlugin()],
});
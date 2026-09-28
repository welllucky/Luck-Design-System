import type { StorybookConfig } from "@storybook/web-components-vite";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.ts"],
  addons: [
    {
      name: "@storybook/addon-docs",
      // Tabelas, listas de tarefas e autolinks do GitHub Flavored Markdown nas páginas MDX.
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  framework: "@storybook/web-components-vite",
  staticDirs: ["../public"],
  docs: { defaultName: "Documentação" },
  core: { disableTelemetry: true },
};

export default config;

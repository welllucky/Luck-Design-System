import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.ts"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: "@storybook/web-components-vite",
  staticDirs: [{ from: "../node_modules/@luck/assets", to: "/assets" }],
  docs: { defaultName: "Documentação" },
  core: { disableTelemetry: true },
};

export default config;

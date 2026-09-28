import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";
import type { BrowserCommand } from "vitest/node";

const dirname = fileURLToPath(new URL(".", import.meta.url));

/** Emula `prefers-reduced-motion` no navegador real (Playwright). */
const emulateReducedMotion: BrowserCommand<[reduce: boolean]> = async (ctx, reduce) => {
  if (!("page" in ctx)) throw new Error("emulateReducedMotion exige o provider Playwright");
  await ctx.page.emulateMedia({ reducedMotion: reduce ? "reduce" : "no-preference" });
};

// Uma instância por projeto: o Vitest altera o objeto ao resolver os projetos.
const browser = () => ({
  enabled: true,
  headless: true,
  provider: playwright(),
  instances: [{ browser: "chromium" as const }],
});

export default defineConfig({
  test: {
    projects: [
      {
        // Cada história do Storybook vira um teste: render + `play` + auditoria de acessibilidade.
        extends: true,
        plugins: [storybookTest({ configDir: `${dirname}.storybook` })],
        test: {
          name: "storybook",
          // O addon aplica sozinho as anotações do preview e do addon-a11y (Storybook 10.3+).
          browser: browser(),
        },
      },
      {
        // Usabilidade: teclado real, foco, alvos de toque, movimento reduzido, reflow e tema claro.
        extends: true,
        test: {
          name: "usabilidade",
          include: ["tests/**/*.test.ts"],
          browser: { ...browser(), viewport: { width: 1280, height: 800 }, commands: { emulateReducedMotion } },
          setupFiles: ["tests/setup.ts"],
        },
      },
    ],
  },
});

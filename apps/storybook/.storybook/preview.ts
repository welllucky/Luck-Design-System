import "@luck/styles/global.css";
import "./preview.css";
import * as luck from "@luck/core/components";
import manifest from "@luck/core/custom-elements.json";
import type { Decorator, Preview } from "@storybook/web-components-vite";
import { setCustomElementsManifest } from "@storybook/web-components-vite";
import theme from "./theme";

// Build de custom elements (o recomendado com bundlers como o Vite): registra todos os componentes.
for (const [name, define] of Object.entries(luck)) {
  if (name.startsWith("defineCustomElement") && typeof define === "function") (define as () => void)();
}
setCustomElementsManifest(manifest);

// Na documentação, qualquer ícone do Lucide fica disponível sob demanda.
luck.setIconLoader(async (name) => {
  const { icons } = await import("lucide");
  const pascal = name.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());
  return icons[pascal as keyof typeof icons] as never;
});

/** Aplica tema e intensidade de movimento no documento, como uma aplicação real faria. */
const withTheme: Decorator = (story, ctx) => {
  const root = document.documentElement;
  root.setAttribute("data-theme", ctx.globals.theme ?? "dark");
  const motion = ctx.globals.motion;
  if (motion && motion !== "padrao") root.setAttribute("data-motion", motion);
  else root.removeAttribute("data-motion");
  return story();
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: "Tema",
      toolbar: {
        title: "Tema",
        icon: "mirror",
        items: [
          { value: "dark", title: "Escuro", icon: "moon" },
          { value: "light", title: "Claro", icon: "sun" },
        ],
        dynamicTitle: true,
      },
    },
    motion: {
      description: "Intensidade do movimento",
      toolbar: {
        title: "Movimento",
        icon: "lightning",
        items: [
          { value: "sutil", title: "Sutil" },
          { value: "padrao", title: "Padrão" },
          { value: "expressivo", title: "Expressivo" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "dark", motion: "padrao" },
  parameters: {
    layout: "padded",
    backgrounds: { disable: true },
    controls: { expanded: true, sort: "requiredFirst" },
    docs: { theme, codePanel: true },
    // Violações de acessibilidade (axe) reprovam o teste da história.
    a11y: { test: "error" },
    options: {
      storySort: {
        order: [
          "Introdução",
          "Fundamentos",
          "Componentes",
          ["Ações", "Formulários", "Exibição", "Navegação", "Feedback", "Marca"],
          "Portfólio",
        ],
      },
    },
  },
};

export default preview;

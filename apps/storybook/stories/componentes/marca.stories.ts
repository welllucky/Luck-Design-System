import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

type LogoArgs = {
  variant: "symbol" | "horizontal" | "stacked" | "signature" | "wordmark" | "app-icon";
  size: number;
  tone: "default" | "mono" | "on-accent" | "accent";
  motion: "none" | "rise" | "press";
};

const meta: Meta<LogoArgs> = {
  title: "Componentes/Marca/Logo",
  component: "luck-logo",
  tags: ["autodocs"],
  args: { variant: "horizontal", size: 48, tone: "default", motion: "rise" },
  argTypes: {
    variant: { control: "select", options: ["symbol", "horizontal", "stacked", "signature", "wordmark", "app-icon"] },
    tone: { control: "inline-radio", options: ["default", "mono", "on-accent", "accent"] },
    motion: { control: "inline-radio", options: ["none", "rise", "press"] },
  },
  render: (a) => html`<luck-logo variant=${a.variant} size=${a.size} tone=${a.tone} motion=${a.motion}></luck-logo>`,
  parameters: {
    docs: {
      description: {
        component:
          "Logo WL3 “Ritmo”: três Ls crescendo (0,382 · 0,618 · 1) sobre uma base comum, o último em âmbar. Não espelhar, girar ou distorcer; nunca azul ou roxo. Mínimo: símbolo 16 px, horizontal 96 px.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<LogoArgs>;

export const Playground: Story = {};

export const Variantes: Story = {
  render: () => html`
    <div class="sb-row" style="gap:40px">
      <luck-logo variant="symbol" size="48"></luck-logo>
      <luck-logo variant="horizontal" size="40"></luck-logo>
      <luck-logo variant="stacked" size="56"></luck-logo>
      <luck-logo variant="signature" size="40"></luck-logo>
      <luck-logo variant="wordmark" size="32"></luck-logo>
      <luck-logo variant="app-icon" size="64"></luck-logo>
    </div>
  `,
};

export const Icones: StoryObj = {
  name: "Ícones",
  parameters: {
    docs: {
      description: {
        story:
          "Lucide com traço 1.75 e tamanho 16. O conjunto padrão cobre o vocabulário do DS; registre outros com `registerIcons({ Rocket })` ou carregue sob demanda com `setIconLoader`.",
      },
    },
  },
  render: () => {
    const names = [
      "arrow-up-right",
      "arrow-right",
      "arrow-down",
      "send",
      "download",
      "check",
      "circle-check",
      "circle-alert",
      "chevron-down",
      "x",
      "menu",
      "sun",
      "moon",
      "mail",
      "link",
      "building-2",
      "sparkles",
      "palette",
      "github",
      "linkedin",
      "instagram",
      "youtube",
      "dribbble",
      "twitter",
    ];
    return html`
      <div class="sb-grid" style="grid-template-columns:repeat(auto-fill,minmax(120px,1fr))">
        ${names.map(
          (n) => html`
            <div style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px">
              <luck-icon name=${n} size="20"></luck-icon>
              <span class="luck-mono">${n}</span>
            </div>
          `,
        )}
      </div>
    `;
  },
};

import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

type ButtonArgs = {
  variant: "primary" | "secondary" | "ghost";
  size: "sm" | "md" | "lg";
  label: string;
  iconLeft?: string;
  iconRight?: string;
  loading: boolean;
  success: boolean;
  disabled: boolean;
  magnetic: boolean;
  fullWidth: boolean;
};

const meta: Meta<ButtonArgs> = {
  title: "Componentes/Ações/Button",
  component: "luck-button",
  tags: ["autodocs"],
  args: {
    variant: "primary",
    size: "md",
    label: "Explorar projetos",
    iconRight: "arrow-up-right",
    loading: false,
    success: false,
    disabled: false,
    magnetic: false,
    fullWidth: false,
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary", "ghost"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    label: { control: "text", description: "Conteúdo do slot padrão." },
  },
  render: (a) => html`
    <luck-button
      variant=${a.variant}
      size=${a.size}
      icon-left=${ifDefined(a.iconLeft || undefined)}
      icon-right=${ifDefined(a.iconRight || undefined)}
      ?loading=${a.loading}
      ?success=${a.success}
      ?disabled=${a.disabled}
      ?magnetic=${a.magnetic}
      ?full-width=${a.fullWidth}
      >${a.label}</luck-button
    >
  `,
  parameters: {
    docs: {
      description: {
        component:
          "Botão tátil (tecla): afunda ao pressionar e volta com mola. Use `primary` para a ação principal (uma por área), `secondary` para alternativas e `ghost` para baixa ênfase. CTAs seguem verbo + destino: “Explorar projetos”, “Falar comigo”.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<ButtonArgs>;

export const Primario: Story = { name: "Primário" };

export const Variantes: Story = {
  render: () => html`
    <div class="sb-row">
      <luck-button icon-right="arrow-up-right">Explorar projetos</luck-button>
      <luck-button variant="secondary" icon-left="download">Baixar currículo em PDF</luck-button>
      <luck-button variant="ghost">Ver frente</luck-button>
    </div>
  `,
};

export const Tamanhos: Story = {
  render: () => html`
    <div class="sb-row">
      <luck-button size="sm">Pequeno</luck-button>
      <luck-button>Médio</luck-button>
      <luck-button size="lg">Grande</luck-button>
    </div>
  `,
};

export const Estados: Story = {
  render: () => html`
    <div class="sb-row">
      <luck-button loading>Enviar</luck-button>
      <luck-button success>Enviar</luck-button>
      <luck-button disabled>Indisponível</luck-button>
      <luck-button magnetic icon-right="send">Magnético</luck-button>
    </div>
  `,
};

export const FluxoDeEnvio: Story = {
  name: "Fluxo de envio",
  render: () => {
    const send = async (e: Event) => {
      const btn = e.currentTarget as HTMLLuckButtonElement;
      btn.loading = true;
      await new Promise((r) => setTimeout(r, 1200));
      btn.loading = false;
      btn.success = true;
      setTimeout(() => (btn.success = false), 1600);
    };
    return html`<luck-button icon-right="send" @click=${send}>Enviar mensagem</luck-button>`;
  },
};

export const IconButton: StoryObj = {
  name: "IconButton",
  parameters: {
    docs: { description: { story: "Tecla só com ícone. `label` é obrigatório: vira nome acessível e dica." } },
  },
  render: () => html`
    <div class="sb-row" style="padding-top:40px">
      <luck-icon-button icon="github" label="GitHub"></luck-icon-button>
      <luck-icon-button icon="mail" label="Copiar e-mail" confirm-icon="check" confirm-label="E-mail copiado"></luck-icon-button>
      <luck-icon-button icon="download" label="Baixar" variant="primary"></luck-icon-button>
      <luck-icon-button icon="x" label="Fechar" variant="ghost" size="sm"></luck-icon-button>
    </div>
  `,
};

import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { listen, part, ready, readyAll } from "../support/dom";

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

export const Primario: Story = {
  name: "Primário",
  play: async ({ canvasElement, step }) => {
    const host = await ready<HTMLLuckButtonElement>(canvasElement, "luck-button");
    const onClick = fn();
    host.addEventListener("click", onClick);
    const btn = part<HTMLButtonElement>(host, "button");

    await step("renderiza um <button> nativo com o rótulo do slot", async () => {
      await expect(btn).toHaveAttribute("type", "button");
      await expect(host).toHaveTextContent("Explorar projetos");
    });
    await step("clique dispara o evento", async () => {
      await userEvent.click(btn);
      await expect(onClick).toHaveBeenCalledTimes(1);
    });
  },
};

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
  play: async ({ canvasElement, step }) => {
    const [loading, success, disabled] = await readyAll<HTMLLuckButtonElement>(canvasElement, "luck-button");

    await step("loading anuncia ocupado e bloqueia o clique", async () => {
      const onClick = fn();
      loading.addEventListener("click", onClick);
      await expect(part(loading, "button")).toHaveAttribute("aria-busy", "true");
      await userEvent.click(part(loading, "button"));
      await expect(onClick).not.toHaveBeenCalled();
    });
    await step("success mostra o ✓ desenhado", async () => {
      await expect(part(success, "button")).toHaveClass("is-success");
    });
    await step("disabled usa o atributo nativo", async () => {
      await expect(part(disabled, "button")).toBeDisabled();
    });
  },
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
  play: async ({ canvasElement, step }) => {
    const host = await ready<HTMLLuckButtonElement>(canvasElement, "luck-button");
    await step("clique → spinner → ✓", async () => {
      await userEvent.click(part(host, "button"));
      await waitFor(() => expect(host.loading).toBe(true));
      await waitFor(() => expect(host.success).toBe(true), { timeout: 3000 });
      await expect(host.loading).toBe(false);
    });
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
  play: async ({ canvasElement, step }) => {
    const [github, copy] = await readyAll<HTMLLuckIconButtonElement>(canvasElement, "luck-icon-button");

    await step("label vira nome acessível", async () => {
      await expect(part(github, "button")).toHaveAccessibleName("GitHub");
    });
    await step("confirm-icon troca o ícone e anuncia a confirmação", async () => {
      const confirmed = listen(copy, "luckConfirm");
      await userEvent.click(part(copy, "button"));
      await waitFor(() => expect(part(copy, "button")).toHaveClass("is-swapped"));
      await expect(part(copy, "[aria-live]")).toHaveTextContent("E-mail copiado");
      await expect(confirmed).toHaveLength(1);
    });
  },
};

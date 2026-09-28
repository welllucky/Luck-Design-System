import { showToast } from "@luck/core/components";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta: Meta = {
  title: "Componentes/Feedback",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const Toast: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Microtexto curto e humano. A barra inferior conta o tempo e pausa no hover. Para empilhar avisos, use `showToast()` de `@luck/core`.",
      },
    },
  },
  render: () => html`
    <div class="sb-stack">
      <luck-toast heading="Mensagem enviada" description="Respondo em até 2 dias úteis." duration="0"></luck-toast>
      <luck-toast heading="Confira o formato do e-mail." tone="danger" icon="circle-alert" duration="0"></luck-toast>
      <luck-button
        variant="secondary"
        @click=${() => showToast({ heading: "E-mail copiado", icon: "check" })}
        >Mostrar aviso</luck-button
      >
    </div>
  `,
};

export const Tooltip: Story = {
  render: () => html`
    <div class="sb-row" style="padding:48px 0">
      <luck-tooltip label="Dica em cima"><luck-button variant="secondary">Passe o mouse</luck-button></luck-tooltip>
      <luck-tooltip label="Dica embaixo" side="bottom"><luck-button variant="ghost">Embaixo</luck-button></luck-tooltip>
    </div>
  `,
};

export const Dialog: Story = {
  render: () => {
    const open = () => ((document.getElementById("demo-dialog") as HTMLLuckDialogElement).open = true);
    const close = () => ((document.getElementById("demo-dialog") as HTMLLuckDialogElement).open = false);
    return html`
      <luck-button @click=${open}>Abrir diálogo</luck-button>
      <luck-dialog
        id="demo-dialog"
        heading="Vamos conversar?"
        description="Conte sobre o próximo desafio. Respondo em até 2 dias úteis."
      >
        <luck-input label="E-mail" type="email"></luck-input>
        <luck-button slot="actions" variant="ghost" @click=${close}>Cancelar</luck-button>
        <luck-button slot="actions" icon-right="send" @click=${close}>Enviar</luck-button>
      </luck-dialog>
    `;
  },
};

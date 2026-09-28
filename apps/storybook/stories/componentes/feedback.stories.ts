import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { showToast } from "@welllucky/luck-core/components";
import { html } from "lit";
import { expect, userEvent, waitFor } from "storybook/test";
import { listen, part, ready, readyAll } from "../support/dom";

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
          "Microtexto curto e humano. A barra inferior conta o tempo e pausa no hover. Para empilhar avisos, use `showToast()` de `@welllucky/luck-core`.",
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
  play: async ({ canvasElement, step }) => {
    const [ok, erro] = await readyAll<HTMLLuckToastElement>(canvasElement, "luck-toast");

    await step("tom de erro usa role=alert; os demais, role=status", async () => {
      await expect(ok).toHaveAttribute("role", "status");
      await expect(erro).toHaveAttribute("role", "alert");
    });
    await step("× fecha com animação e emite luckClose", async () => {
      const closed = listen(ok, "luckClose");
      await userEvent.click(part(ok, "button.close"));
      await waitFor(() => expect(closed).toHaveLength(1), { timeout: 2000 });
    });
    await step("showToast empilha um aviso na região viva", async () => {
      const trigger = await ready<HTMLLuckButtonElement>(canvasElement, "luck-button");
      await userEvent.click(part(trigger, "button"));
      const region = await waitFor(() => {
        const r = document.getElementById("luck-toast-region");
        if (!r?.querySelector("luck-toast")) throw new Error("sem aviso");
        return r;
      });
      await expect(region).toHaveAttribute("aria-live", "polite");
      region.remove();
    });
  },
};

export const Tooltip: Story = {
  render: () => html`
    <div class="sb-row" style="padding:48px 0">
      <luck-tooltip label="Dica em cima"><luck-button variant="secondary">Passe o mouse</luck-button></luck-tooltip>
      <luck-tooltip label="Dica embaixo" side="bottom"><luck-button variant="ghost">Embaixo</luck-button></luck-tooltip>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const [top, bottom] = await readyAll<HTMLLuckTooltipElement>(canvasElement, "luck-tooltip");
    await expect(part(top, "[role=tooltip]")).toHaveTextContent("Dica em cima");
    await expect(part(bottom, "[role=tooltip]")).toHaveClass("tip--bottom");
  },
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
  play: async ({ canvasElement, step }) => {
    const trigger = await ready<HTMLLuckButtonElement>(canvasElement, "luck-button");
    const dialog = await ready<HTMLLuckDialogElement>(canvasElement, "luck-dialog");
    const native = () => part<HTMLDialogElement>(dialog, "dialog");

    await step("abre como modal com nome acessível", async () => {
      await userEvent.click(part(trigger, "button"));
      await waitFor(() => expect(native().open).toBe(true));
      await expect(native()).toHaveAccessibleName("Vamos conversar?");
    });
    await step("Esc fecha e informa o motivo", async () => {
      const closed = listen<{ reason: string }>(dialog, "luckClose");
      native().dispatchEvent(new Event("cancel", { cancelable: true }));
      await waitFor(() => expect(dialog.open).toBe(false));
      await expect(closed.at(-1)?.detail.reason).toBe("escape");
      await waitFor(() => expect(native().open).toBe(false));
    });
    await step("× fecha pelo botão", async () => {
      await dialog.show();
      await waitFor(() => expect(native().open).toBe(true));
      const closed = listen<{ reason: string }>(dialog, "luckClose");
      const x = part(dialog, "luck-icon-button");
      await userEvent.click(part(x, "button"));
      await expect(closed.at(-1)?.detail.reason).toBe("button");
      await waitFor(() => expect(native().open).toBe(false));
    });
  },
};

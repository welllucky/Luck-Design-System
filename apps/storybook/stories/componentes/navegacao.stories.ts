import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect, userEvent, waitFor } from "storybook/test";
import { deepActive, listen, part, parts, press, ready } from "../support/dom";

const meta: Meta = {
  title: "Componentes/Navegação",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj;

const links = JSON.stringify([
  { label: "Início", href: "#inicio" },
  { label: "Frentes", href: "#frentes" },
  { label: "Conhecimentos", href: "#conhecimentos" },
  { label: "Sobre", href: "#sobre" },
]);

export const Navbar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Logo que pressiona no hover, links com traço âmbar, troca de tema em círculo (View Transitions) e CTA. Abaixo de 760 px vira menu. Para SPA, chame `preventDefault()` em `luckNavigate`.",
      },
    },
  },
  render: () => html`
    <luck-navbar
      links=${links}
      active="#inicio"
      cta-label="Falar comigo"
      cta-href="#contato"
      @luckNavigate=${(e: CustomEvent) => e.preventDefault()}
    ></luck-navbar>
  `,
  play: async ({ canvasElement, step }) => {
    const nav = await ready<HTMLLuckNavbarElement>(canvasElement, "luck-navbar");
    const links = parts<HTMLAnchorElement>(nav, ".link");

    await step("link ativo marca aria-current", async () => {
      await expect(links[0]).toHaveAttribute("aria-current", "page");
      await expect(links[1]).not.toHaveAttribute("aria-current");
    });
    await step("clique emite luckNavigate cancelável (SPA)", async () => {
      const events = listen<{ value: string }>(nav, "luckNavigate");
      const before = location.hash;
      await userEvent.click(links[2]);
      await expect(events.at(-1)?.detail.value).toBe("#conhecimentos");
      await expect(location.hash).toBe(before);
    });
    await step("botão de tema troca o data-theme do documento", async () => {
      const root = document.documentElement;
      const initial = root.getAttribute("data-theme");
      const toggle = part(nav, 'button[aria-label^="Usar tema"]');
      await expect(toggle).toHaveAccessibleName("Usar tema claro");
      await userEvent.click(toggle);
      await waitFor(() => expect(root).toHaveAttribute("data-theme", "light"));
      root.setAttribute("data-theme", initial ?? "dark");
    });
  },
};

export const Tabs: Story = {
  render: () => html`
    <luck-tabs>
      <luck-tab value="todos" label="Todos"><p class="luck-body">Todos os projetos.</p></luck-tab>
      <luck-tab value="produto" label="Produto"><p class="luck-body">Projetos de produto.</p></luck-tab>
      <luck-tab value="design" label="Design"><p class="luck-body">Projetos de design.</p></luck-tab>
      <luck-tab value="open" label="Open source"><p class="luck-body">Projetos abertos.</p></luck-tab>
    </luck-tabs>
  `,
  play: async ({ canvasElement, step }) => {
    const tabs = await ready<HTMLLuckTabsElement>(canvasElement, "luck-tabs");
    const buttons = () => parts<HTMLButtonElement>(tabs, "[role=tab]");
    const panel = (v: string) => tabs.querySelector(`luck-tab[value="${v}"]`)!;

    await step("primeira aba ativa, só ela visível e focável", async () => {
      await expect(buttons()[0]).toHaveAttribute("aria-selected", "true");
      await expect(buttons()[1]).toHaveAttribute("tabindex", "-1");
      await waitFor(() => expect(panel("todos")).toBeVisible());
      await expect(panel("produto")).not.toBeVisible();
    });
    await step("clique troca a aba e emite luckChange", async () => {
      const events = listen<{ value: string }>(tabs, "luckChange");
      await userEvent.click(buttons()[2]);
      await waitFor(() => expect(tabs.value).toBe("design"));
      await expect(events.at(-1)?.detail.value).toBe("design");
      await waitFor(() => expect(panel("design")).toBeVisible());
    });
    await step("setas, Home e End navegam e movem o foco", async () => {
      buttons()[2].focus();
      press(buttons()[2], "ArrowRight");
      await waitFor(() => expect(tabs.value).toBe("open"));
      await expect(deepActive()).toBe(buttons()[3]);
      press(buttons()[3], "ArrowRight");
      await waitFor(() => expect(tabs.value).toBe("todos"));
      press(buttons()[0], "End");
      await waitFor(() => expect(tabs.value).toBe("open"));
      press(buttons()[3], "Home");
      await waitFor(() => expect(tabs.value).toBe("todos"));
    });
  },
};

export const TabsLarguraTotal: Story = {
  name: "Tabs · largura total",
  render: () => html`
    <luck-tabs full-width>
      <luck-tab value="mensal" label="Mensal"></luck-tab>
      <luck-tab value="anual" label="Anual"></luck-tab>
    </luck-tabs>
  `,
};

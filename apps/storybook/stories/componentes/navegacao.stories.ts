import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

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

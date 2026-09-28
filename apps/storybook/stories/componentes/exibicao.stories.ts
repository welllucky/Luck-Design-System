import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta: Meta = {
  title: "Componentes/Exibição",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const Badge: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Azul sinaliza **somente empresas** e roxo **somente conhecimentos**. Âmbar é disponibilidade e destaque.",
      },
    },
  },
  render: () => html`
    <div class="sb-row">
      <luck-badge tone="accent" dot>Disponível para projetos</luck-badge>
      <luck-badge tone="company" icon="building-2">FCx Labs</luck-badge>
      <luck-badge tone="knowledge" icon="sparkles">Design de interfaces</luck-badge>
      <luck-badge tone="danger">Erro</luck-badge>
      <luck-badge>Neutro</luck-badge>
    </div>
  `,
};

export const Tag: Story = {
  render: () => html`
    <div class="sb-row">
      <luck-tag>Angular</luck-tag>
      <luck-tag>Stencil</luck-tag>
      <luck-tag>Figma</luck-tag>
    </div>
  `,
};

export const Avatar: Story = {
  render: () => html`
    <div class="sb-row">
      <luck-avatar name="Wellington Braga" src="./wellington-braga-face.png" size="56" status></luck-avatar>
      <luck-avatar name="Wellington Braga" size="40"></luck-avatar>
      <luck-avatar name="Ana Lima" size="32"></luck-avatar>
    </div>
  `,
};

export const Card: Story = {
  parameters: {
    docs: {
      description: { story: "Superfície elevada com barra de título: índice âmbar, rótulo mono, dica e três pontos." },
    },
  },
  render: () => html`
    <div class="sb-grid">
      <luck-card index="01" heading="Frentes" hint="3 itens">
        <h3 class="luck-h4">Do design <span class="luck-accent">à engenharia.</span></h3>
        <p class="luck-small">Luz âmbar segue o cursor.</p>
      </luck-card>
      <luck-card index="02" heading="Com inclinação" tilt>
        <h3 class="luck-h4">Card com tilt 3D</h3>
        <p class="luck-small">Intensidade via <code>--motion-tilt</code>.</p>
      </luck-card>
      <luck-card>
        <p class="luck-small">Sem barra de título.</p>
      </luck-card>
    </div>
  `,
};

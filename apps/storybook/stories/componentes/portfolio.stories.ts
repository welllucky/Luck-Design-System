import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta: Meta = {
  title: "Portfólio",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Componentes de conteúdo do portfólio, construídos sobre os primitivos do Luck.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

export const ProjectCard: Story = {
  render: () => html`
    <div class="sb-grid">
      <luck-project-card
        index="01"
        heading="Faça a Lista"
        description="Lista de compras que transforma dados em ferramenta de combate à fome."
        tags='["Angular","Firebase","UX"]'
        company="WL3"
        period="2024 — hoje"
        image="./faca-a-lista.svg"
      ></luck-project-card>
    </div>
  `,
};

export const Timeline: Story = {
  render: () => html`
    <luck-timeline
      items=${JSON.stringify([
        {
          title: "Senior Software Engineer · Tech Lead",
          company: "FCx Labs",
          period: "2022 — hoje",
          description: "Liderança técnica de squads de produto.",
        },
        { title: "Software Engineer", company: "FCx Labs", period: "2020 — 2022" },
        { title: "Designer gráfico", period: "2016 — 2020" },
      ])}
    ></luck-timeline>
  `,
};

export const SkillList: Story = {
  render: () => html`
    <div style="max-width:420px">
      <luck-skill-list
        items=${JSON.stringify([
          {
            title: "Front-end",
            icon: "smartphone",
            stack: "ANGULAR · REACT · STENCIL",
            summary: "Interfaces com movimento e acessibilidade.",
          },
          { title: "Back-end", icon: "server", stack: "NODE · POSTGRES", summary: "APIs e integrações." },
          { title: "Design", icon: "pen-tool", stack: "FIGMA · DESIGN SYSTEMS", summary: "Do conceito ao componente." },
        ])}
      ></luck-skill-list>
    </div>
  `,
};

export const SocialLinks: Story = {
  render: () => {
    const links = JSON.stringify([
      { network: "github", href: "https://github.com/welllucky" },
      { network: "linkedin", href: "https://linkedin.com" },
      { network: "instagram", href: "https://instagram.com" },
      { network: "mail", href: "mailto:contato@example.com" },
    ]);
    return html`
      <div class="sb-stack" style="padding-top:40px">
        <luck-social-links links=${links}></luck-social-links>
        <luck-social-links links=${links} variant="button"></luck-social-links>
      </div>
    `;
  },
};

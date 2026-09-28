import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect, userEvent, waitFor } from "storybook/test";
import { listen, part, parts, ready, readyAll } from "../support/dom";

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
  play: async ({ canvasElement, step }) => {
    const card = await ready<HTMLLuckProjectCardElement>(canvasElement, "luck-project-card");

    await step("mostra título, tags e empresa", async () => {
      await expect(part(card, "h3")).toHaveTextContent("Faça a Lista");
      await expect(parts(card, "luck-tag")).toHaveLength(3);
      await expect(part(card, ".company")).toHaveTextContent("WL3");
    });
    await step("luckOpen é cancelável para abrir um diálogo no lugar do link", async () => {
      const opened = listen<{ href: string }>(card, "luckOpen");
      card.addEventListener("luckOpen", (e) => e.preventDefault(), { once: true });
      const before = location.href;
      await userEvent.click(part(card, "a.link"));
      await expect(opened).toHaveLength(1);
      await expect(location.href).toBe(before);
    });
  },
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
  play: async ({ canvasElement }) => {
    const timeline = await ready<HTMLLuckTimelineElement>(canvasElement, "luck-timeline");
    const items = parts(timeline, "li");
    await expect(items).toHaveLength(3);
    await expect(items[0]).toHaveClass("is-current");
    await expect(part(timeline, "ol")).toBeInTheDocument();
  },
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
  play: async ({ canvasElement, step }) => {
    const list = await ready<HTMLLuckSkillListElement>(canvasElement, "luck-skill-list");
    const heads = () => parts<HTMLButtonElement>(list, "button.head");

    await step("primeiro item começa aberto", async () => {
      await expect(heads()[0]).toHaveAttribute("aria-expanded", "true");
      await expect(heads()[1]).toHaveAttribute("aria-expanded", "false");
    });
    await step("abrir outro fecha o anterior (sanfona)", async () => {
      await userEvent.click(heads()[1]);
      await waitFor(() => expect(heads()[1]).toHaveAttribute("aria-expanded", "true"));
      await expect(heads()[0]).toHaveAttribute("aria-expanded", "false");
    });
    await step("clicar no aberto fecha todos", async () => {
      await userEvent.click(heads()[1]);
      await waitFor(() => expect(list.open).toBe(-1));
    });
    await step("reabrir o primeiro volta ao estado inicial", async () => {
      await userEvent.click(heads()[0]);
      // Espera a transição terminar para a auditoria de contraste medir a cor final.
      await waitFor(() => expect(getComputedStyle(part(list, ".is-open .panel p")).opacity).toBe("1"));
    });
  },
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
  play: async ({ canvasElement }) => {
    const [icons, buttons] = await readyAll<HTMLLuckSocialLinksElement>(canvasElement, "luck-social-links");
    const iconLinks = parts<HTMLLuckIconButtonElement>(icons, "luck-icon-button");
    await expect(iconLinks).toHaveLength(4);
    await Promise.all(iconLinks.map((b) => b.componentOnReady?.()));
    const github = part<HTMLAnchorElement>(iconLinks[0], "a");
    await expect(github).toHaveAccessibleName("GitHub");
    await expect(github).toHaveAttribute("target", "_blank");
    await expect(github).toHaveAttribute("rel", "noreferrer");
    // E-mail abre no próprio app de correio, sem nova aba.
    await expect(part(iconLinks[3], "a")).not.toHaveAttribute("target");
    await expect(parts(buttons, "luck-button")).toHaveLength(4);
  },
};

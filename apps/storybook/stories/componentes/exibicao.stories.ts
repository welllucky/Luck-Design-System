import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect, userEvent } from "storybook/test";
import { listen, part, parts, ready, readyAll } from "../support/dom";

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
  play: async ({ canvasElement }) => {
    const [disponivel, empresa] = await readyAll<HTMLLuckBadgeElement>(canvasElement, "luck-badge");
    await expect(disponivel).toHaveAttribute("tone", "accent");
    await expect(part(disponivel, ".dot")).toBeInTheDocument();
    await expect(part(empresa, "luck-icon")).toHaveAttribute("name", "building-2");
  },
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
  play: async ({ canvasElement }) => {
    const [foto, iniciais] = await readyAll<HTMLLuckAvatarElement>(canvasElement, "luck-avatar");
    await expect(part(foto, "img")).toHaveAttribute("alt", "Wellington Braga");
    await expect(part(foto, "[role=status]")).toHaveAccessibleName("Disponível");
    await expect(part(iniciais, "[role=img]")).toHaveTextContent("WB");
    await expect(part(iniciais, "[role=img]")).toHaveAccessibleName("Wellington Braga");
  },
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
  play: async ({ canvasElement }) => {
    const [comBarra, , semBarra] = await readyAll<HTMLLuckCardElement>(canvasElement, "luck-card");
    await expect(part(comBarra, ".bar b")).toHaveTextContent("01");
    await expect(part(comBarra, ".bar small")).toHaveTextContent("3 itens");
    await expect(parts(semBarra, ".bar")).toHaveLength(0);
    await ready(canvasElement, "luck-card[tilt]");
  },
};

export const Stat: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Métrica em destaque: título com ícone Lucide, número com unidade e legenda. Com `href`, o bloco vira um link só (destinos inseguros são descartados) e emite `luckOpen` cancelável; o slot padrão fica fora do link (ex.: um `luck-meter`). `pending` marca o que ainda não existe.",
      },
    },
  },
  render: () => html`
    <div class="sb-grid">
      <luck-stat
        heading="Projetos"
        icon="palette"
        value="24"
        unit="publicados"
        caption="3 em rascunho"
        href="#projetos"
        @luckOpen=${(e: CustomEvent) => e.preventDefault()}
      >
        <luck-badge slot="badge" tone="accent">3 novos</luck-badge>
      </luck-stat>
      <luck-stat heading="Conhecimentos" icon="sparkles" value="36" unit="de 43" caption="com evidência">
        <luck-meter label="Conhecimentos com evidência" tone="knowledge" value="36" max="43" compact></luck-meter>
      </luck-stat>
      <luck-stat heading="Relatórios" icon="send" value="Em breve" caption="exportação em PDF" pending></luck-stat>
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const [link, extra, pendente] = await readyAll<HTMLLuckStatElement>(canvasElement, "luck-stat");

    await step("com href, título, número, unidade e legenda formam um link só", async () => {
      const a = part<HTMLAnchorElement>(link, "a.card");
      await expect(a).toHaveAttribute("href", "#projetos");
      await expect(a).toHaveTextContent(/Projetos.*24 publicados.*3 em rascunho/);
      await expect(part(link, "luck-icon")).toHaveAttribute("name", "palette");
    });
    await step("clique emite luckOpen cancelável", async () => {
      const opened = listen<{ href: string }>(link, "luckOpen");
      const before = location.hash;
      await userEvent.click(part(link, "a.card"));
      await expect(opened.at(-1)?.detail.href).toBe("#projetos");
      await expect(location.hash).toBe(before);
    });
    await step("sem href não há link; o slot padrão fica fora do bloco", async () => {
      await expect(parts(extra, "a")).toHaveLength(0);
      await expect(extra.querySelector("luck-meter")).toBeInTheDocument();
    });
    await step("pending é refletido", async () => {
      await expect(pendente).toHaveAttribute("pending");
    });
  },
};

export const Meter: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Grandeza num intervalo conhecido (cobertura, aderência, orçamento), com `<meter>` nativo e o texto do valor em `aria-valuetext`. Âmbar é o padrão; azul só para empresas e roxo só para conhecimentos. `compact` esconde rótulo e valor visíveis.",
      },
    },
  },
  render: () => html`
    <div class="sb-stack">
      <luck-meter label="Projetos com evidência" value="7" max="9" value-text="7 / 9"></luck-meter>
      <luck-meter label="Empresas com resultado descrito" tone="company" value="11" max="13" value-text="11 / 13"></luck-meter>
      <luck-meter label="Conhecimentos citáveis" tone="knowledge" value="36" max="43" value-text="36 / 43"></luck-meter>
      <luck-meter label="Gasto do mês" tone="neutral" value="3.2" max="10" value-text="R$ 3,20 de R$ 10"></luck-meter>
      <luck-meter label="Armazenamento" tone="danger" value="98"></luck-meter>
      <luck-meter label="Cobertura" value="60" compact></luck-meter>
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const meters = await readyAll<HTMLLuckMeterElement>(canvasElement, "luck-meter");

    await step("meter nativo com nome e valor em texto", async () => {
      const meter = part<HTMLMeterElement>(meters[0], "meter");
      await expect(meter).toHaveAccessibleName("Projetos com evidência");
      await expect(meter).toHaveAttribute("aria-valuetext", "7 / 9");
      await expect(meter.value).toBe(7);
      await expect(meter.max).toBe(9);
    });
    await step("tons refletidos e porcentagem como padrão", async () => {
      await expect(meters[1]).toHaveAttribute("tone", "company");
      await expect(meters[2]).toHaveAttribute("tone", "knowledge");
      await expect(part(meters[4], "meter")).toHaveAttribute("aria-valuetext", "98%");
    });
    await step("compact esconde o rótulo visível e mantém o nome", async () => {
      await expect(parts(meters[5], ".label")).toHaveLength(0);
      await expect(part(meters[5], "meter")).toHaveAccessibleName("Cobertura");
    });
  },
};

export const Message: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Mensagens de uma conversa com um assistente. A pergunta alinha à direita; a resposta, à esquerda, com as fontes no slot `citations`. O autor é lido antes do texto; ponha a conversa num `role="log"` para anunciar respostas novas.',
      },
    },
  },
  render: () => html`
    <div role="log" aria-label="Conversa de exemplo" class="sb-stack" style="max-width:640px">
      <luck-message from="user" author="Você">Quais projetos usam Stencil?</luck-message>
      <luck-message from="assistant" author="Assistente">
        <p>Dois: o próprio Luck e o portfólio, que consome os componentes pelo adaptador de React.</p>
        <luck-tag slot="citations">Luck</luck-tag>
        <luck-tag slot="citations">Portfólio</luck-tag>
      </luck-message>
      <luck-message from="user" author="Você">E o salário de cada projeto?</luck-message>
      <luck-message from="assistant" author="Assistente">
        <p>Não tenho essa informação. Posso falar sobre o trabalho e as tecnologias usadas.</p>
        <luck-badge slot="citations" tone="danger">Sem fonte</luck-badge>
      </luck-message>
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const [pergunta, resposta] = await readyAll<HTMLLuckMessageElement>(canvasElement, "luck-message");

    await step("autor lido antes do texto", async () => {
      await expect(part(pergunta, ".sr-only")).toHaveTextContent("Você:");
      await expect(part(resposta, ".sr-only")).toHaveTextContent("Assistente:");
    });
    await step("lados refletidos e fontes só na resposta", async () => {
      await expect(pergunta).toHaveAttribute("from", "user");
      await expect(parts(pergunta, "[role=group]")).toHaveLength(0);
      const fontes = part(resposta, "[role=group]");
      await expect(fontes).toHaveAccessibleName("Fontes");
      await expect(fontes).not.toHaveAttribute("hidden");
      await expect(resposta.querySelectorAll('[slot="citations"]')).toHaveLength(2);
    });
  },
};

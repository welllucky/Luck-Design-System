import { newSpecPage } from "@stencil/core/testing";
import { LuckBadge } from "../components/luck-badge/luck-badge";
import { LuckButton } from "../components/luck-button/luck-button";
import { LuckCard } from "../components/luck-card/luck-card";
import { LuckCheckbox } from "../components/luck-checkbox/luck-checkbox";
import { LuckIcon } from "../components/luck-icon/luck-icon";
import { LuckLogo } from "../components/luck-logo/luck-logo";
import { LuckMessage } from "../components/luck-message/luck-message";
import { LuckMeter } from "../components/luck-meter/luck-meter";
import { LuckNavRail } from "../components/luck-nav-rail/luck-nav-rail";
import { LuckSelect } from "../components/luck-select/luck-select";
import { LuckStat } from "../components/luck-stat/luck-stat";
import { LuckTab } from "../components/luck-tab/luck-tab";
import { LuckTabs } from "../components/luck-tabs/luck-tabs";
import { toKebab } from "../icons/registry";
import { check } from "../utils/field";
import { parseList, safeHref } from "../utils/utils";

describe("utils", () => {
  it("parseList aceita array, JSON e lista separada por vírgulas", () => {
    expect(parseList(["a"])).toEqual(["a"]);
    expect(parseList('["a","b"]')).toEqual(["a", "b"]);
    expect(parseList("a, b")).toEqual(["a", "b"]);
    expect(parseList(undefined)).toEqual([]);
  });

  it("toKebab segue a nomenclatura do Lucide", () => {
    expect(toKebab("ArrowUpRight")).toBe("arrow-up-right");
    expect(toKebab("Building2")).toBe("building-2");
    expect(toKebab("github")).toBe("github");
  });

  it("check traduz o retorno do validador", () => {
    expect(check((v) => v.includes("@") || "E-mail inválido", "a@b")).toEqual({ valid: true });
    expect(check((v) => v.includes("@") || "E-mail inválido", "ab")).toEqual({
      valid: false,
      error: "E-mail inválido",
    });
    expect(check(() => false, "x").error).toBe("Confira este campo.");
  });

  it("safeHref aceita caminhos e http(s) e recusa esquemas perigosos", () => {
    expect(safeHref("/projetos")).toBe("/projetos");
    expect(safeHref("#fontes")).toBe("#fontes");
    expect(safeHref("https://example.com/x")).toBe("https://example.com/x");
    expect(safeHref("javascript:alert(1)")).toBeUndefined();
    expect(safeHref("data:text/html,x")).toBeUndefined();
    expect(safeHref("//evil.test")).toBeUndefined();
    expect(safeHref("/\\evil.test")).toBeUndefined();
    expect(safeHref(undefined)).toBeUndefined();
  });
});

describe("luck-icon", () => {
  it("renderiza um ícone registrado como SVG decorativo", async () => {
    const page = await newSpecPage({ components: [LuckIcon], html: `<luck-icon name="arrow-up-right"></luck-icon>` });
    const svg = page.root!.shadowRoot!.querySelector("svg")!;
    expect(svg).not.toBeNull();
    expect(svg.querySelectorAll("path").length).toBe(2);
    expect(page.root!.getAttribute("aria-hidden")).toBe("true");
  });

  it("vira imagem acessível com label", async () => {
    const page = await newSpecPage({
      components: [LuckIcon],
      html: `<luck-icon name="github" label="GitHub"></luck-icon>`,
    });
    expect(page.root!.getAttribute("role")).toBe("img");
    expect(page.root!.getAttribute("aria-label")).toBe("GitHub");
  });
});

describe("luck-button", () => {
  it("usa <a> quando recebe href", async () => {
    const page = await newSpecPage({ components: [LuckButton], html: `<luck-button href="/x">Ir</luck-button>` });
    expect(page.root!.shadowRoot!.querySelector("a")!.getAttribute("href")).toBe("/x");
  });

  it("aplica variante, tamanho e estado de carregamento", async () => {
    const page = await newSpecPage({
      components: [LuckButton],
      html: `<luck-button variant="secondary" size="lg" loading>Enviar</luck-button>`,
    });
    const btn = page.root!.shadowRoot!.querySelector("button")!;
    expect(btn).toHaveClasses(["key", "key--secondary", "key--lg", "is-loading"]);
    expect(btn.getAttribute("aria-busy")).toBe("true");
  });
});

describe("luck-badge", () => {
  it("reflete o tom", async () => {
    const page = await newSpecPage({
      components: [LuckBadge],
      html: `<luck-badge tone="company">FCx Labs</luck-badge>`,
    });
    expect(page.root!.getAttribute("tone")).toBe("company");
  });
});

describe("luck-card", () => {
  it("mostra a barra de título quando há heading ou index", async () => {
    const page = await newSpecPage({
      components: [LuckCard],
      html: `<luck-card index="01" heading="Botões"></luck-card>`,
    });
    const bar = page.root!.shadowRoot!.querySelector(".bar")!;
    expect(bar.querySelector("b")!.textContent).toBe("01");
    expect(bar.querySelector("span")!.textContent).toBe("Botões");
  });

  it("omite a barra sem heading", async () => {
    const page = await newSpecPage({ components: [LuckCard], html: `<luck-card></luck-card>` });
    expect(page.root!.shadowRoot!.querySelector(".bar")).toBeNull();
  });
});

describe("luck-logo", () => {
  it("usa o símbolo reduzido abaixo de 24 px", async () => {
    const page = await newSpecPage({ components: [LuckLogo], html: `<luck-logo size="16"></luck-logo>` });
    const first = page.root!.shadowRoot!.querySelector("path")!.getAttribute("d");
    expect(first).toBe("M0 61.8H20V80H29V100H0Z");
  });
});

describe("luck-checkbox", () => {
  it("alterna e emite luckChange", async () => {
    const page = await newSpecPage({
      components: [LuckCheckbox],
      html: `<luck-checkbox label="Aceito"></luck-checkbox>`,
    });
    const spy = jest.fn();
    page.root!.addEventListener("luckChange", spy);
    const input = page.root!.shadowRoot!.querySelector("input")!;
    input.checked = true;
    input.dispatchEvent(new Event("change"));
    await page.waitForChanges();
    expect(page.root!.checked).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].detail).toEqual({ checked: true });
  });
});

describe("luck-tabs", () => {
  const html = `<luck-tabs>
    <luck-tab value="a" label="Frentes">A</luck-tab>
    <luck-tab value="b" label="Projetos">B</luck-tab>
  </luck-tabs>`;

  it("ativa a primeira aba por padrão", async () => {
    const page = await newSpecPage({ components: [LuckTabs, LuckTab], html });
    const buttons = page.root!.shadowRoot!.querySelectorAll('[role="tab"]');
    expect(buttons.length).toBe(2);
    expect(buttons[0].getAttribute("aria-selected")).toBe("true");
    expect(page.root!.querySelector('luck-tab[value="a"]')!.hasAttribute("active")).toBe(true);
  });

  it("troca de aba no clique e emite luckChange", async () => {
    const page = await newSpecPage({ components: [LuckTabs, LuckTab], html });
    const spy = jest.fn();
    page.root!.addEventListener("luckChange", spy);
    (page.root!.shadowRoot!.querySelectorAll('[role="tab"]')[1] as HTMLElement).click();
    await page.waitForChanges();
    expect(page.root!.value).toBe("b");
    expect(spy.mock.calls[0][0].detail).toEqual({ value: "b" });
    expect(page.root!.querySelector('luck-tab[value="b"]')!.hasAttribute("active")).toBe(true);
  });
});

describe("luck-select", () => {
  it("usa o <option selected> filho como valor inicial", async () => {
    const page = await newSpecPage({
      components: [LuckSelect],
      html: `<luck-select label="Assunto"><option value="a">A</option><option value="b" selected>B</option></luck-select>`,
    });
    // Com filhos <option>, o mock-doc não define page.root; buscamos o host diretamente.
    const select = page.body.querySelector("luck-select") as HTMLLuckSelectElement;
    expect(select.value).toBe("b");
  });

  it("aceita options em JSON e prioriza o value explícito", async () => {
    const page = await newSpecPage({
      components: [LuckSelect],
      html: `<luck-select label="Assunto" options='["X","Y"]' value="Y"></luck-select>`,
    });
    const options = page.root!.shadowRoot!.querySelectorAll("option");
    expect(options.length).toBe(2);
    expect(page.root!.value).toBe("Y");
  });
});

describe("luck-nav-rail", () => {
  const items = JSON.stringify([
    { label: "Início", href: "/inicio", icon: "sun" },
    { label: "Projetos", href: "/projetos", icon: "palette" },
    { label: "Contato", href: "/contato", icon: "mail" },
  ]);

  it("renderiza um nav nomeado com um link por seção e marca a aberta", async () => {
    const page = await newSpecPage({
      components: [LuckNavRail],
      html: `<luck-nav-rail items='${items}' active="/projetos"></luck-nav-rail>`,
    });
    const nav = page.root!.shadowRoot!.querySelector("nav")!;
    expect(nav.getAttribute("aria-label")).toBe("Navegação principal");
    expect(page.root!.getAttribute("orientation")).toBe("auto");
    const links = nav.querySelectorAll("a");
    expect(links.length).toBe(3);
    expect(links[0].getAttribute("href")).toBe("/inicio");
    expect(links[0].querySelector("luck-icon")!.getAttribute("name")).toBe("sun");
    expect(links[1].getAttribute("aria-current")).toBe("page");
    expect(links[0].hasAttribute("aria-current")).toBe(false);
  });

  it("reflete a orientação e emite luckNavigate cancelável", async () => {
    const page = await newSpecPage({
      components: [LuckNavRail],
      html: `<luck-nav-rail items='${items}' orientation="horizontal" label="Seções"></luck-nav-rail>`,
    });
    expect(page.root!.getAttribute("orientation")).toBe("horizontal");
    expect(page.root!.shadowRoot!.querySelector("nav")!.getAttribute("aria-label")).toBe("Seções");
    const spy = jest.fn((e: Event) => e.preventDefault());
    page.root!.addEventListener("luckNavigate", spy);
    (page.root!.shadowRoot!.querySelectorAll("a")[2] as HTMLElement).click();
    await page.waitForChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect((spy.mock.calls[0][0] as CustomEvent).detail).toEqual({ value: "/contato", href: "/contato" });
  });
});

describe("luck-stat", () => {
  it("vira um link só com título, número, unidade e legenda", async () => {
    const page = await newSpecPage({
      components: [LuckStat],
      html: `<luck-stat heading="Projetos" icon="palette" value="24" unit="publicados" caption="3 em rascunho" href="/projetos"></luck-stat>`,
    });
    const link = page.root!.shadowRoot!.querySelector("a")!;
    expect(link.getAttribute("href")).toBe("/projetos");
    expect(link.querySelector("luck-icon")!.getAttribute("name")).toBe("palette");
    const text = link.textContent!.replace(/\s+/g, " ");
    expect(text).toContain("Projetos");
    expect(text).toContain("24 publicados");
    expect(text).toContain("3 em rascunho");
  });

  it("descarta destinos inseguros e reflete pending", async () => {
    const page = await newSpecPage({
      components: [LuckStat],
      html: `<luck-stat heading="Mau" value="1" href="javascript:alert(1)" pending></luck-stat>`,
    });
    expect(page.root!.shadowRoot!.querySelector("a")).toBeNull();
    expect(page.root!.shadowRoot!.querySelector("div.card")).not.toBeNull();
    expect(page.root!.hasAttribute("pending")).toBe(true);
  });

  it("emite luckOpen cancelável ao clicar", async () => {
    const page = await newSpecPage({
      components: [LuckStat],
      html: `<luck-stat heading="Projetos" value="24" href="/projetos"></luck-stat>`,
    });
    const spy = jest.fn();
    page.root!.addEventListener("luckOpen", spy);
    (page.root!.shadowRoot!.querySelector("a") as HTMLElement).click();
    await page.waitForChanges();
    expect(spy.mock.calls[0][0].detail).toEqual({ href: "/projetos" });
  });
});

describe("luck-meter", () => {
  it("expõe o valor como texto e o limita ao intervalo", async () => {
    const page = await newSpecPage({
      components: [LuckMeter],
      html: `<luck-meter label="Projetos com evidência" value="7" max="9" value-text="7 / 9"></luck-meter>`,
    });
    const meter = page.root!.shadowRoot!.querySelector("meter")!;
    expect(meter.getAttribute("aria-label")).toBe("Projetos com evidência");
    expect(meter.getAttribute("aria-valuetext")).toBe("7 / 9");
    expect(page.root!.shadowRoot!.querySelector(".label")!.textContent).toContain("Projetos com evidência");
    expect(page.root!.getAttribute("tone")).toBe("accent");

    page.root!.value = 20;
    page.root!.valueText = undefined;
    page.root!.compact = true;
    await page.waitForChanges();
    expect(page.root!.shadowRoot!.querySelector(".label")).toBeNull();
    expect(page.root!.shadowRoot!.querySelector("meter")!.getAttribute("aria-valuetext")).toBe("100%");
    expect(page.root!.hasAttribute("compact")).toBe(true);
  });

  it("reflete o tom", async () => {
    const page = await newSpecPage({
      components: [LuckMeter],
      html: `<luck-meter label="Repertório" tone="knowledge" value="3" max="4"></luck-meter>`,
    });
    expect(page.root!.getAttribute("tone")).toBe("knowledge");
    expect(page.root!.shadowRoot!.querySelector("meter")!.getAttribute("aria-valuetext")).toBe("75%");
  });
});

describe("luck-message", () => {
  it("anuncia o autor e mostra as fontes só nas respostas", async () => {
    const page = await newSpecPage({
      components: [LuckMessage],
      html: `<luck-message author="Assistente"><p>Sim.</p><a slot="citations" href="#fonte">Fonte</a></luck-message>`,
    });
    const root = page.root!.shadowRoot!;
    expect(page.root!.getAttribute("from")).toBe("assistant");
    expect(root.querySelector(".sr-only")!.textContent).toBe("Assistente: ");
    const group = root.querySelector('[role="group"]')!;
    expect(group.getAttribute("aria-label")).toBe("Fontes");
    expect(group.hasAttribute("hidden")).toBe(false);

    page.root!.from = "user";
    await page.waitForChanges();
    expect(root.querySelector('[role="group"]')).toBeNull();
  });

  it("esconde o grupo de fontes quando não há citações", async () => {
    const page = await newSpecPage({
      components: [LuckMessage],
      html: `<luck-message><p>Sem fontes.</p></luck-message>`,
    });
    expect(page.root!.shadowRoot!.querySelector('[role="group"]')!.hasAttribute("hidden")).toBe(true);
    expect(page.root!.shadowRoot!.querySelector(".sr-only")).toBeNull();
  });
});

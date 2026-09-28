import { newSpecPage } from "@stencil/core/testing";
import { LuckBadge } from "../components/luck-badge/luck-badge";
import { LuckButton } from "../components/luck-button/luck-button";
import { LuckCard } from "../components/luck-card/luck-card";
import { LuckCheckbox } from "../components/luck-checkbox/luck-checkbox";
import { LuckIcon } from "../components/luck-icon/luck-icon";
import { LuckLogo } from "../components/luck-logo/luck-logo";
import { LuckTab } from "../components/luck-tab/luck-tab";
import { LuckTabs } from "../components/luck-tabs/luck-tabs";
import { toKebab } from "../icons/registry";
import { check } from "../utils/field";
import { parseList } from "../utils/utils";

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

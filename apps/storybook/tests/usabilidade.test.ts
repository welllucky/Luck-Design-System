/**
 * Testes de usabilidade: comportam-se como uma pessoa usando o sistema.
 * Teclado real (Playwright), foco, alvos de toque, movimento reduzido, reflow e contraste nos dois temas.
 */
import { afterEach, expect, describe as grupo, it } from "vitest";
import { commands, page, userEvent } from "vitest/browser";
import { activeHost, axeViolations, deepActive, describe, mount, part, settle, wait } from "./helpers";

afterEach(async () => {
  await commands.emulateReducedMotion(false);
  await page.viewport(1280, 800);
});

const FORM = `
  <form>
    <luck-input label="Nome" name="nome" required></luck-input>
    <luck-textarea label="Mensagem" name="mensagem"></luck-textarea>
    <luck-select label="Assunto" name="assunto" options='["Projeto","Mentoria"]' value="Projeto"></luck-select>
    <luck-checkbox label="Aceito ser contatado" name="aceite"></luck-checkbox>
    <luck-radio-group label="Formato" name="formato" value="remoto">
      <luck-radio value="remoto" label="Remoto"></luck-radio>
      <luck-radio value="hibrido" label="Híbrido"></luck-radio>
    </luck-radio-group>
    <luck-switch label="Receber novidades" name="novidades"></luck-switch>
    <luck-button type="submit">Enviar</luck-button>
  </form>
`;

grupo("teclado", () => {
  it("Tab percorre o formulário na ordem visual, com uma parada por grupo de radio", async () => {
    await mount(FORM);
    const order: string[] = [];
    for (let i = 0; i < 7; i++) {
      await userEvent.tab();
      order.push(describe(activeHost()));
    }
    expect(order, order.join(" → ")).toEqual([
      "luck-input[Nome]",
      "luck-textarea[Mensagem]",
      "luck-select[Assunto]",
      "luck-checkbox[Aceito ser contatado]",
      "luck-radio[Remoto]",
      "luck-switch[Receber novidades]",
      "luck-button[Enviar]",
    ]);
  });

  it("Espaço marca checkbox e switch; setas trocam o radio", async () => {
    const root = await mount(FORM);
    const checkbox = root.querySelector<HTMLLuckCheckboxElement>("luck-checkbox")!;
    const group = root.querySelector<HTMLLuckRadioGroupElement>("luck-radio-group")!;
    const sw = root.querySelector<HTMLLuckSwitchElement>("luck-switch")!;

    await checkbox.setFocus();
    await userEvent.keyboard(" ");
    await expect.poll(() => checkbox.checked).toBe(true);

    await root.querySelector<HTMLLuckRadioElement>("luck-radio")!.setFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect.poll(() => group.value).toBe("hibrido");
    expect(describe(activeHost())).toBe("luck-radio[Híbrido]");

    await sw.setFocus();
    await userEvent.keyboard(" ");
    await expect.poll(() => sw.checked).toBe(true);
  });

  it("Enter no botão submit envia o formulário", async () => {
    const root = await mount(FORM);
    const form = root.querySelector("form")!;
    let submitted: FormData | undefined;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      submitted = new FormData(form);
    });
    await userEvent.type(part(root.querySelector("luck-input")!, "input"), "Wellington");
    await root.querySelector<HTMLLuckButtonElement>("luck-button")!.setFocus();
    await userEvent.keyboard("{Enter}");
    await expect.poll(() => submitted?.get("nome")).toBe("Wellington");
    expect(submitted?.get("assunto")).toBe("Projeto");
    expect(submitted?.get("formato")).toBe("remoto");
  });

  it("abas: Tab entra na aba ativa, setas navegam e Tab seguinte vai para o painel", async () => {
    const root = await mount(`
      <luck-tabs>
        <luck-tab value="a" label="Todos"><p>A</p></luck-tab>
        <luck-tab value="b" label="Produto"><p>B</p></luck-tab>
        <luck-tab value="c" label="Design"><p>C</p></luck-tab>
      </luck-tabs>`);
    const tabs = root.querySelector<HTMLLuckTabsElement>("luck-tabs")!;
    await userEvent.tab();
    expect(deepActive()?.textContent).toBe("Todos");
    await userEvent.keyboard("{ArrowRight}");
    await expect.poll(() => tabs.value).toBe("b");
    expect(deepActive()?.textContent).toBe("Produto");
    await userEvent.keyboard("{End}");
    await expect.poll(() => tabs.value).toBe("c");
    await userEvent.tab();
    expect(activeHost()).toBe(root.querySelector('luck-tab[value="c"]'));
  });
});

grupo("foco", () => {
  it("todo controle mostra um indicador de foco visível ao navegar por teclado", async () => {
    await commands.emulateReducedMotion(true); // mede o anel de foco final, não o meio da transição
    await mount(FORM);
    const semIndicador: string[] = [];
    for (let i = 0; i < 7; i++) {
      await userEvent.tab();
      const el = deepActive() as HTMLElement;
      // O indicador pode estar no próprio controle ou na caixa visual irmã (checkbox/radio).
      const candidates = [el, el.nextElementSibling as HTMLElement | null].filter(Boolean) as HTMLElement[];
      const hasIndicator = () =>
        candidates.some((c) => {
          const s = getComputedStyle(c);
          const outline = s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 2;
          const ring = /\b0px 0px 0px 2px\b/.test(s.boxShadow);
          return outline || ring;
        });
      // O anel precisa aparecer logo após o foco (até 500 ms), mesmo com a máquina sob carga.
      let visible = false;
      for (let t = 0; t < 25 && !visible; t++) {
        visible = hasIndicator();
        if (!visible) await wait(20);
      }
      if (!visible) {
        const s = getComputedStyle(el);
        semIndicador.push(`${describe(activeHost())} (outline: ${s.outline}; box-shadow: ${s.boxShadow})`);
      }
    }
    expect(semIndicador, semIndicador.join("\n")).toEqual([]);
  });

  it("diálogo: foco entra ao abrir, fica preso dentro, Esc fecha e o foco volta ao gatilho", async () => {
    const root = await mount(`
      <luck-button id="abrir">Abrir</luck-button>
      <luck-dialog heading="Vamos conversar?">
        <luck-input label="E-mail"></luck-input>
        <luck-button slot="actions">Enviar</luck-button>
      </luck-dialog>`);
    const trigger = root.querySelector<HTMLLuckButtonElement>("#abrir")!;
    const dialog = root.querySelector<HTMLLuckDialogElement>("luck-dialog")!;
    trigger.addEventListener("click", () => dialog.show());

    await trigger.setFocus();
    await userEvent.keyboard("{Enter}");
    await expect.poll(() => part<HTMLDialogElement>(dialog, "dialog").open).toBe(true);
    // O foco vai para dentro do diálogo (conteúdo projetado ou controles do próprio painel).
    // No fim do ciclo o Chromium leva o foco à interface do navegador (activeElement = body): é o
    // comportamento nativo de <dialog> modal. O que não pode é cair em outro elemento da página.
    const inside = () => {
      const host = activeHost();
      return !host || host === document.body || host === dialog || dialog.contains(host);
    };
    expect(inside(), describe(activeHost())).toBe(true);

    // Com o modal aberto, Tab nunca sai do diálogo.
    for (let i = 0; i < 6; i++) {
      await userEvent.tab();
      expect(inside(), describe(activeHost())).toBe(true);
    }

    await userEvent.keyboard("{Escape}");
    await expect.poll(() => part<HTMLDialogElement>(dialog, "dialog").open).toBe(false);
    expect(activeHost()).toBe(trigger);
  });
});

grupo("alvos de toque", () => {
  it("controles interativos têm ao menos 24 × 24 px (WCAG 2.5.8)", async () => {
    await commands.emulateReducedMotion(true); // mede o tamanho final, sem escala de entrada
    const root = await mount(`
      ${FORM}
      <luck-icon-button icon="x" label="Fechar" size="sm"></luck-icon-button>
      <luck-button size="sm">Pequeno</luck-button>
      <luck-tabs><luck-tab value="a" label="A"></luck-tab><luck-tab value="b" label="B"></luck-tab></luck-tabs>
      <luck-toast heading="Mensagem enviada" duration="0"></luck-toast>
      <luck-skill-list items='[{"title":"Front-end"}]'></luck-skill-list>
    `);
    await wait(20);
    const targets: [string, Element][] = [
      ...Array.from(root.querySelectorAll("luck-button, luck-icon-button")).map(
        (h) => [describe(h), part(h, "[part=control]")] as [string, Element],
      ),
      ...Array.from(root.querySelectorAll("luck-checkbox, luck-radio")).map(
        (h) => [describe(h), part(h, "label")] as [string, Element],
      ),
      ["luck-switch", part(root.querySelector("luck-switch")!, "[role=switch]")],
      ["luck-tabs", part(root.querySelector("luck-tabs")!, "[role=tab]")],
      ["luck-toast ×", part(root.querySelector("luck-toast")!, "button.close")],
      ["luck-skill-list", part(root.querySelector("luck-skill-list")!, "button.head")],
    ];
    const pequenos = targets
      .map(([name, el]) => [name, el.getBoundingClientRect()] as const)
      .filter(([, r]) => r.width < 24 || r.height < 24)
      .map(([name, r]) => `${name}: ${Math.round(r.width)}×${Math.round(r.height)}`);
    expect(pequenos, pequenos.join("; ")).toEqual([]);
  });
});

grupo("movimento", () => {
  it("prefers-reduced-motion desliga animações também dentro do Shadow DOM", async () => {
    await commands.emulateReducedMotion(true);
    const root = await mount(`<luck-button loading>Enviar</luck-button><luck-badge dot>Disponível</luck-badge>`);
    const spinner = part(root.querySelector("luck-button")!, ".spinner");
    const dot = part(root.querySelector("luck-badge")!, ".dot");
    expect(parseFloat(getComputedStyle(spinner).animationDuration)).toBeLessThanOrEqual(0.001);
    expect(parseFloat(getComputedStyle(dot, "::after").animationDuration)).toBeLessThanOrEqual(0.001);
    expect(
      parseFloat(getComputedStyle(part(root.querySelector("luck-button")!, "button")).transitionDuration),
    ).toBeLessThanOrEqual(0.001);
  });
});

grupo("layout", () => {
  it("em 320 px (zoom de 400 %) nada transborda na horizontal e a navbar vira menu", async () => {
    await page.viewport(320, 640);
    const root = await mount(`
      <luck-navbar links='[{"label":"Início","href":"#"},{"label":"Frentes","href":"#f"},{"label":"Sobre","href":"#s"}]'
        cta-label="Falar comigo"></luck-navbar>
      ${FORM}
      <luck-card index="01" heading="Frentes"><p>Do design à engenharia.</p></luck-card>`);
    await settle(root);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(320);

    const nav = root.querySelector("luck-navbar")!;
    const menu = part(nav, "luck-icon-button.menu");
    expect(getComputedStyle(menu).display).not.toBe("none");
    expect(getComputedStyle(part(nav, ".links")).display).toBe("none");
    await userEvent.click(part(menu, "button"));
    await expect.poll(() => getComputedStyle(part(nav, ".links")).display).toBe("flex");
    expect(part(menu, "button").getAttribute("aria-expanded")).toBe("true");
  });
});

grupo("contraste e semântica (axe)", () => {
  const TUDO = `
    ${FORM}
    <luck-input label="Com erro" value="x" error="Confira este campo."></luck-input>
    <luck-button variant="secondary">Secundário</luck-button>
    <luck-button variant="ghost">Fantasma</luck-button>
    <luck-icon-button icon="github" label="GitHub"></luck-icon-button>
    <luck-badge tone="accent" dot>Disponível</luck-badge>
    <luck-badge tone="company">FCx Labs</luck-badge>
    <luck-badge tone="knowledge">Design</luck-badge>
    <luck-badge tone="danger">Erro</luck-badge>
    <luck-tag>Stencil</luck-tag>
    <luck-avatar name="Wellington Braga" status></luck-avatar>
    <luck-card index="01" heading="Frentes" hint="3 itens"><p>Conteúdo</p></luck-card>
    <luck-tabs><luck-tab value="a" label="Todos"><p>A</p></luck-tab><luck-tab value="b" label="Produto"></luck-tab></luck-tabs>
    <luck-toast heading="Mensagem enviada" description="Respondo em até 2 dias úteis." duration="0"></luck-toast>
    <luck-timeline items='[{"title":"Tech Lead","company":"FCx Labs","period":"2022 — hoje"}]'></luck-timeline>
    <luck-skill-list items='[{"title":"Front-end","stack":"ANGULAR · STENCIL","summary":"Interfaces."}]'></luck-skill-list>
    <luck-logo variant="signature" size="40"></luck-logo>
  `;

  for (const theme of ["dark", "light"] as const) {
    it(`sem violações WCAG 2.2 AA no tema ${theme === "dark" ? "escuro" : "claro"}`, async () => {
      await commands.emulateReducedMotion(true); // mede as cores finais, sem transições pela metade
      const root = await mount(TUDO, theme);
      await wait(50);
      const violations = await axeViolations(root);
      expect(violations, violations.join("\n")).toEqual([]);
    });
  }
});

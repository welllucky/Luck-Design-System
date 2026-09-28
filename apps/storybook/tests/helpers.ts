import axe from "axe-core";

type Stencil = HTMLElement & { componentOnReady?: () => Promise<unknown> };

/** Monta HTML num contêiner limpo e espera todos os componentes `luck-*` carregarem. */
export async function mount(markup: string, theme: "dark" | "light" = "dark"): Promise<HTMLElement> {
  document.body.innerHTML = "";
  document.documentElement.setAttribute("data-theme", theme);
  const root = document.createElement("main");
  root.style.padding = "24px";
  root.innerHTML = markup;
  document.body.appendChild(root);
  await settle(root);
  return root;
}

/** Espera os componentes (inclusive os aninhados em shadow roots) terminarem de renderizar. */
export async function settle(root: ParentNode = document) {
  for (let i = 0; i < 3; i++) {
    const hosts = collect(root);
    await Promise.all(hosts.map((h) => (h as Stencil).componentOnReady?.()));
    await frame();
  }
}

function collect(root: ParentNode): Element[] {
  const out: Element[] = [];
  for (const el of Array.from(root.querySelectorAll("*"))) {
    if (el.localName.startsWith("luck-")) out.push(el);
    if (el.shadowRoot) out.push(...collect(el.shadowRoot));
  }
  return out;
}

export const frame = () => new Promise((r) => requestAnimationFrame(() => r(null)));
export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Elemento com foco real, descendo pelos shadow roots. */
export function deepActive(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
}

/** Elemento do documento (fora de shadow roots) que contém o foco, ex.: o `luck-input` focado. */
export function activeHost(): Element | null {
  let el = deepActive();
  while (el && el.getRootNode() !== document) el = (el.getRootNode() as ShadowRoot).host;
  return el;
}

export function part<T extends Element = HTMLElement>(host: Element, selector: string): T {
  const found = host.shadowRoot?.querySelector<T>(selector);
  if (!found) throw new Error(`${selector} não encontrado em <${host.localName}>`);
  return found;
}

/** Descreve o elemento focado para mensagens legíveis: `luck-input[label=Nome]`. */
export function describe(el: Element | null): string {
  if (!el) return "(nada)";
  const label = el.getAttribute("label") ?? el.getAttribute("value") ?? el.textContent?.trim().slice(0, 20);
  return `${el.localName}${label ? `[${label}]` : ""}`;
}

/** Roda o axe (atravessa Shadow DOM) e devolve as violações de forma legível. */
export async function axeViolations(root: Element) {
  const result = await axe.run(root, {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
  });
  return result.violations.map(
    (v) =>
      `${v.id}: ${v.nodes.map((n) => `${n.target.join(" ")} — ${n.failureSummary?.split("\n").slice(1).join(" ").trim()}`).join(" | ")}`,
  );
}

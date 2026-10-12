/** Junta classes ignorando valores falsos. */
export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

/**
 * Props de lista aceitam array (via propriedade JS) ou JSON (via atributo HTML):
 * `<luck-select options='["A","B"]'>`.
 */
export function parseList<T>(value: T[] | string | null | undefined): T[] {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return value.split(",").map((v) => v.trim()) as unknown as T[];
  }
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Lê uma variável numérica de movimento (--motion-tilt, --motion-magnet) no escopo do elemento. */
export const motionVar = (el: Element, name: string) => parseFloat(getComputedStyle(el).getPropertyValue(name)) || 0;

let uid = 0;
export const nextId = (prefix: string) => `${prefix}-${++uid}`;

/** Filhos diretos com a tag dada (sem `:scope`, que o SSR/mock-doc não suporta). */
export const childrenByTag = <T extends Element>(el: Element, tag: string): T[] =>
  Array.from(el.children).filter((c) => c.tagName.toLowerCase() === tag) as T[];

/**
 * Destino de link seguro: aceita caminhos relativos (`/x`, `./x`, `?q`, `#id`) e URLs `http`/`https`;
 * recusa `javascript:`, `data:` e afins. Barras invertidas, espaços e controles são recusados porque o
 * navegador os normaliza (`/\host` e `/<tab>/host` viram `//host`).
 */
export function safeHref(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const href = value.trim();
  // biome-ignore lint/suspicious/noControlCharactersInRegex: recusa controles que o navegador remove da URL.
  if (href === "" || /[\u0000- \u007f\\]/.test(href)) return undefined;
  if (href.startsWith("//")) return undefined;
  if (/^[/?#.]/.test(href)) return href;
  return /^https?:\/\/[^/]/i.test(href) ? href : undefined;
}

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

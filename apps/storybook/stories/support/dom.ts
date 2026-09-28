/**
 * Utilitários para testar Web Components com Shadow DOM nos `play` das histórias.
 * O Testing Library não atravessa shadow roots; estes helpers fazem a ponte.
 */
import { waitFor } from "storybook/test";

type Stencil = HTMLElement & { componentOnReady?: () => Promise<unknown> };

/** Espera o elemento existir no canvas e o componente Stencil terminar de carregar. */
export async function ready<T extends HTMLElement = HTMLElement>(root: ParentNode, selector: string): Promise<T> {
  const el = await waitFor(() => {
    const found = root.querySelector<T>(selector);
    if (!found) throw new Error(`${selector} não apareceu no canvas`);
    return found;
  });
  await (el as Stencil).componentOnReady?.();
  return el;
}

/** Todos os elementos do seletor, já carregados. */
export async function readyAll<T extends HTMLElement = HTMLElement>(root: ParentNode, selector: string): Promise<T[]> {
  await ready(root, selector);
  const all = Array.from(root.querySelectorAll<T>(selector));
  await Promise.all(all.map((el) => (el as Stencil).componentOnReady?.()));
  return all;
}

/** Busca dentro do shadow root de um componente; falha com mensagem clara. */
export function part<T extends Element = HTMLElement>(host: Element, selector: string): T {
  const found = host.shadowRoot?.querySelector<T>(selector);
  if (!found) throw new Error(`${selector} não encontrado em <${host.localName}>`);
  return found;
}

export function parts<T extends Element = HTMLElement>(host: Element, selector: string): T[] {
  return Array.from(host.shadowRoot?.querySelectorAll<T>(selector) ?? []);
}

/** Elemento focado de verdade, descendo pelos shadow roots. */
export function deepActive(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
}

/** Dispara uma tecla que atravessa o Shadow DOM (bubbles + composed). */
export function press(target: Element, key: string) {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, composed: true, cancelable: true }));
}

/** Registra os eventos emitidos por um elemento durante o teste. */
export function listen<T = unknown>(el: EventTarget, name: string) {
  const calls: CustomEvent<T>[] = [];
  el.addEventListener(name, (e) => calls.push(e as CustomEvent<T>));
  return calls;
}

export type Theme = "dark" | "light";

/** Tema atual do documento (ou de um escopo). O escuro é o padrão. */
export function getTheme(scope: Element = document.documentElement): Theme {
  return scope.closest("[data-theme]")?.getAttribute("data-theme") === "light" ? "light" : "dark";
}

/**
 * Aplica o tema com a transição de círculo (View Transitions) a partir de `origin`.
 * Sem suporte a View Transitions ou com movimento reduzido, a troca é imediata.
 */
export function setTheme(theme: Theme, origin?: Element, scope: HTMLElement = document.documentElement): Theme {
  const root = document.documentElement;
  if (origin) {
    const r = origin.getBoundingClientRect();
    root.style.setProperty("--vt-x", `${r.left + r.width / 2}px`);
    root.style.setProperty("--vt-y", `${r.top + r.height / 2}px`);
  }
  const apply = () => scope.setAttribute("data-theme", theme);
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (doc.startViewTransition && !reduce) doc.startViewTransition(apply);
  else apply();
  return theme;
}

export function toggleTheme(origin?: Element, scope: HTMLElement = document.documentElement): Theme {
  return setTheme(getTheme(scope) === "dark" ? "light" : "dark", origin, scope);
}

import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Download,
  Link,
  Mail,
  Menu,
  Moon,
  Palette,
  Send,
  Sparkles,
  Sun,
  X,
} from "lucide";
import { brandIcons } from "./brand";

/** Nó de ícone no formato do Lucide: lista de elementos filhos do `<svg>`. */
export type IconNode = [tag: string, attrs: Record<string, string | number>][];
export type IconLoader = (name: string) => IconNode | undefined | Promise<IconNode | undefined>;

const icons = new Map<string, IconNode>();
const listeners = new Set<() => void>();
let loader: IconLoader | undefined;

/** "ArrowUpRight" → "arrow-up-right"; nomes já em kebab-case passam intactos. */
export const toKebab = (name: string) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .replace(/([a-zA-Z])(\d)/g, "$1-$2")
    .toLowerCase();

/**
 * Registra ícones para `<luck-icon name="…">`. Aceita o objeto de ícones do Lucide diretamente:
 *
 * ```ts
 * import { Rocket, Github } from "lucide";
 * registerIcons({ Rocket, Github }); // <luck-icon name="rocket">
 * ```
 */
export function registerIcons(record: Record<string, IconNode>): void {
  for (const [name, node] of Object.entries(record)) icons.set(toKebab(name), node);
  for (const notify of listeners) notify();
}

/**
 * Define como carregar ícones que não foram registrados. Útil para carregar o Lucide inteiro sob demanda:
 *
 * ```ts
 * setIconLoader(async (name) => {
 *   const { icons } = await import("lucide");
 *   return icons[name.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase())];
 * });
 * ```
 */
export function setIconLoader(fn: IconLoader | undefined): void {
  loader = fn;
  for (const notify of listeners) notify();
}

const pending = new Map<string, Promise<IconNode | undefined>>();

export function getIcon(name: string): IconNode | undefined {
  return icons.get(name);
}

export async function loadIcon(name: string): Promise<IconNode | undefined> {
  const found = icons.get(name);
  if (found || !loader) return found;
  let p = pending.get(name);
  if (!p) {
    p = Promise.resolve(loader(name)).then((node) => {
      if (node) icons.set(name, node);
      return node;
    });
    pending.set(name, p);
  }
  return p;
}

export function onIconsChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Ícones usados pelos próprios componentes e pelo vocabulário da marca.
registerIcons({
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Download,
  Link,
  Mail,
  Menu,
  Moon,
  Palette,
  Send,
  Sparkles,
  Sun,
  X,
  ...brandIcons,
} as Record<string, IconNode>);

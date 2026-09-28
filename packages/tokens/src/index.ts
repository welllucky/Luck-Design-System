/**
 * Tokens do Luck, o design system do WL3 (linguagem V4 · Tátil). Fonte única: `scripts/build.ts` gera o CSS e o JSON a partir deste arquivo.
 *
 * Referências entre tokens usam a forma `{grupo.tom}` (ex.: `{ink.900}`). No CSS elas viram
 * `var(--ink-900)`; em `resolved` elas viram o valor final.
 */

/** Paleta crua. Âmbar é o único acento de interface; azul sinaliza empresas; roxo, conhecimentos. */
export const palette = {
  amber: { 300: "#FFCB3D", 400: "#F5B301", 600: "#C08A00", 700: "#A87A00", 800: "#8A5A00", ink: "#1C1300" },
  blue: { 400: "#4DB2FF", 500: "#0D98FF", 700: "#126EB3" },
  purple: { 400: "#B46CFF", 500: "#850DFF", 700: "#6112B3" },
  red: { 400: "#FF7A66", 700: "#B42318" },
  ink: {
    950: "#0C0C0B",
    900: "#111110",
    850: "#161614",
    800: "#1A1A18",
    750: "#222220",
    700: "#2C2C29",
    500: "#6A6A65",
    400: "#9C9C98",
    50: "#F4F4F2",
  },
  paper: {
    0: "#FFFFFF",
    50: "#F6F5F1",
    100: "#EDECE7",
    200: "#E6E5DF",
    400: "#8F8F89",
    600: "#5F5F5A",
    950: "#131312",
  },
} as const;

export const gradients = {
  mark: "linear-gradient(146deg,#FFCB3D -13%,#F5B301 60%,#E09E00 112%)",
  protection: "linear-gradient(0deg,var(--bg) 0%,transparent 40%)",
} as const;

/** Cores semânticas por tema. O escuro é o padrão; o claro entra com `data-theme="light"` em qualquer escopo. */
export const themes = {
  dark: {
    bg: "{ink.900}",
    "surface-1": "{ink.800}",
    "surface-2": "{ink.750}",
    "surface-3": "{ink.700}",
    well: "{ink.950}",
    field: "{ink.850}",
    fg: "{ink.50}",
    "fg-muted": "{ink.400}",
    "fg-faint": "{ink.500}",
    border: "rgba(255,255,255,.08)",
    "border-strong": "rgba(255,255,255,.18)",
    accent: "{amber.400}",
    "on-accent": "{amber.ink}",
    "accent-text": "{amber.400}",
    "accent-key": "{amber.700}",
    interactive: "{amber.400}",
    "on-interactive": "{amber.ink}",
    "signal-company": "{blue.400}",
    "signal-knowledge": "{purple.400}",
    danger: "{red.400}",
    key: "#050505",
    glow: "rgba(245,179,1,.07)",
    "tooltip-bg": "{ink.50}",
    "tooltip-fg": "{ink.900}",
    "logo-ink": "{ink.50}",
    "logo-accent": "{amber.400}",
  },
  light: {
    bg: "{paper.100}",
    "surface-1": "{paper.0}",
    "surface-2": "{paper.50}",
    "surface-3": "{paper.0}",
    well: "{paper.200}",
    field: "{paper.0}",
    fg: "{paper.950}",
    "fg-muted": "{paper.600}",
    "fg-faint": "{paper.400}",
    border: "rgba(0,0,0,.08)",
    "border-strong": "rgba(0,0,0,.2)",
    accent: "{amber.400}",
    "on-accent": "{amber.ink}",
    "accent-text": "{amber.800}",
    "accent-key": "{amber.600}",
    interactive: "{amber.800}",
    "on-interactive": "#FFFFFF",
    "signal-company": "{blue.700}",
    "signal-knowledge": "{purple.700}",
    danger: "{red.700}",
    key: "rgba(0,0,0,.14)",
    glow: "rgba(245,179,1,.16)",
    "tooltip-bg": "{paper.950}",
    "tooltip-fg": "{paper.0}",
    "logo-ink": "{paper.950}",
    "logo-accent": "{amber.600}",
  },
} as const;

export const typography = {
  font: {
    sans: "'Manrope',system-ui,sans-serif",
    mono: "'JetBrains Mono',ui-monospace,monospace",
  },
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700, black: 800 },
  text: {
    display: "76px",
    h1: "56px",
    h2: "40px",
    h3: "28px",
    h4: "20px",
    lead: "18px",
    body: "16px",
    sm: "14px",
    xs: "13px",
    caption: "12px",
    micro: "11px",
  },
  leading: { tight: 1, snug: 1.2, normal: 1.5, relaxed: 1.6 },
  tracking: { display: "-.045em", heading: "-.03em", tight: "-.01em", mono: ".06em" },
} as const;

export const spacing = {
  space: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    7: "32px",
    8: "40px",
    9: "48px",
    10: "64px",
    11: "96px",
  },
  layout: {
    "pad-card": "22px",
    "pad-control": "16px",
    "gap-grid": "20px",
    container: "1240px",
    "container-read": "760px",
    "hit-min": "44px",
  },
} as const;

/** Media queries não aceitam variáveis CSS; use estes valores em `@media (min-width: …)`. */
export const breakpoints = { sm: "701px", md: "1001px", mobileMenu: "760px" } as const;

/** V5 · Raio vivo: raio ≈ altura ÷ 10, teto de 8 px. Círculo só para avatar, status e radio. */
export const radius = { xs: "2px", sm: "3px", md: "4px", lg: "6px", xl: "8px", full: "999px" } as const;

/** Elevação tátil: tecla, superfície elevada, poço rebaixado. Recalculada em cada escopo de tema. */
export const shadows = {
  base: {
    key: "0 3px 0 var(--key),inset 0 1px 0 rgba(255,255,255,.1)",
    "key-accent": "0 3px 0 var(--accent-key),inset 0 1px 0 rgba(255,255,255,.45)",
    "key-sm": "0 2px 0 var(--key)",
    pressed: "0 0 0 var(--key)",
    raised: "0 1px 0 rgba(255,255,255,.04) inset,0 2px 4px rgba(0,0,0,.3),0 16px 32px -12px rgba(0,0,0,.6)",
    float: "0 30px 60px -30px rgba(0,0,0,.6)",
    well: "inset 0 2px 4px rgba(0,0,0,.45)",
  },
  light: {
    raised: "0 1px 2px rgba(0,0,0,.06),0 12px 28px -12px rgba(0,0,0,.18)",
    well: "inset 0 2px 3px rgba(0,0,0,.1)",
    float: "0 30px 60px -30px rgba(0,0,0,.3)",
  },
  ring: "0 0 0 2px var(--interactive)",
} as const;

/** Movimento: tecla, luz, resposta e revelação. Intensidade via `data-motion="sutil|expressivo"`. */
export const motion = {
  duration: { press: "90ms", fast: "160ms", base: "240ms", slow: "420ms", reveal: "700ms", stagger: "70ms" },
  easing: {
    standard: "cubic-bezier(.2,0,0,1)",
    emphasized: "cubic-bezier(.16,1,.3,1)",
    spring: "cubic-bezier(.34,1.56,.64,1)",
  },
  tilt: 6,
  magnet: 0.22,
  modes: {
    sutil: {
      "ease-spring": "cubic-bezier(.2,0,0,1)",
      "motion-tilt": 2,
      "motion-magnet": 0,
      "d-reveal": "420ms",
      "d-slow": "320ms",
    },
    expressivo: {
      "ease-spring": "cubic-bezier(.34,1.9,.5,1)",
      "motion-tilt": 11,
      "motion-magnet": 0.4,
      "d-slow": "520ms",
      "d-reveal": "950ms",
    },
  },
} as const;

export type ThemeName = keyof typeof themes;
export type SemanticColor = keyof (typeof themes)["dark"];

const REF = /^\{([a-z]+)\.([a-z0-9]+)\}$/;

/** Resolve uma referência `{grupo.tom}` para o valor da paleta. Outros valores voltam intactos. */
export function resolveColor(value: string): string {
  const m = REF.exec(value);
  if (!m) return value;
  const group = palette[m[1] as keyof typeof palette] as Record<string, string> | undefined;
  const resolved = group?.[m[2]];
  if (!resolved) throw new Error(`Token de cor desconhecido: ${value}`);
  return resolved;
}

/** Cores semânticas de um tema com os valores finais (útil fora do CSS: canvas, e-mail, React Native). */
export function resolveTheme(theme: ThemeName): Record<SemanticColor, string> {
  const out = {} as Record<SemanticColor, string>;
  for (const [k, v] of Object.entries(themes[theme])) out[k as SemanticColor] = resolveColor(v);
  return out;
}

/** Nome da variável CSS de uma cor semântica: `cssVar("accent")` → `var(--accent)`. */
export const cssVar = (token: SemanticColor | (string & {})): string => `var(--${token})`;

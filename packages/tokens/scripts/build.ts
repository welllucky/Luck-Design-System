// Gera dist/css/*.css, dist/tokens.css e dist/tokens.json a partir de src/index.ts.
// Roda direto no Node (type stripping): `node scripts/build.ts`.
import { mkdir, writeFile } from "node:fs/promises";
import {
  breakpoints,
  gradients,
  motion,
  palette,
  radius,
  resolveColor,
  resolveTheme,
  shadows,
  spacing,
  themes,
  typography,
} from "../src/index.ts";

const dist = new URL("../dist/", import.meta.url);
const HEADER = "/* Gerado por @luck/tokens — não edite. Fonte: packages/tokens/src/index.ts */\n";

const ref = (v: string | number) => String(v).replace(/^\{([a-z]+)\.([a-z0-9]+)\}$/, "var(--$1-$2)");
const decls = (entries: [string, string | number][], indent = "  ") =>
  entries.map(([k, v]) => `${indent}--${k}: ${ref(v)};`).join("\n");
const block = (selector: string, entries: [string, string | number][]) => `${selector} {\n${decls(entries)}\n}\n`;
const prefixed = (prefix: string, obj: Record<string, string | number>) =>
  Object.entries(obj).map(([k, v]) => [`${prefix}-${k}`, v] as [string, string | number]);

const paletteEntries = Object.entries(palette).flatMap(([group, tones]) => prefixed(group, tones));
const gradientEntries = prefixed("gradient", gradients);

const themeEntries = (name: keyof typeof themes) =>
  [...Object.entries(themes[name]), ["color-scheme", name]] as [string, string][];
const themeDecl = (name: keyof typeof themes) =>
  themeEntries(name)
    .map(([k, v]) => (k === "color-scheme" ? `  color-scheme: ${v};` : `  --${k}: ${ref(v)};`))
    .join("\n");

const shadowBase = prefixed("shadow", shadows.base);
const shadowLight = prefixed("shadow", shadows.light);

const colors = [
  "/* Âmbar é o único acento de interface; azul sinaliza empresas; roxo, conhecimentos. */",
  block(":root", [...paletteEntries, ...gradientEntries]),
  "/* Tema escuro (padrão) */",
  `:root,\n[data-theme="dark"] {\n${themeDecl("dark")}\n}\n`,
  "/* Tema claro */",
  `[data-theme="light"] {\n${themeDecl("light")}\n}\n`,
  "/* Opt-in: segue a preferência do sistema */",
  `@media (prefers-color-scheme: light) {\n  [data-theme="auto"] {\n${themeDecl("light").replace(/^/gm, "  ")}\n  }\n}\n`,
].join("\n");

const type = block(":root", [
  ["font-sans", typography.font.sans],
  ["font-mono", typography.font.mono],
  ...prefixed("weight", typography.weight),
  ...prefixed("text", typography.text),
  ...prefixed("leading", typography.leading),
  ...prefixed("tracking", typography.tracking),
]);

const space = block(":root", [...prefixed("space", spacing.space), ...Object.entries(spacing.layout)]);

const radii = [
  "/* V5 · Raio vivo: raio ≈ altura ÷ 10, teto de 8 px; círculo só para avatar, status e radio. */",
  block(":root", prefixed("radius", radius)),
].join("\n");

const elevation = [
  "/* Elevação tátil, recalculada em cada escopo de tema para acompanhar --key e --accent-key. */",
  block(":root,\n[data-theme]", [...shadowBase, ["ring", shadows.ring]]),
  block('[data-theme="light"]', shadowLight),
  `@media (prefers-color-scheme: light) {\n  [data-theme="auto"] {\n${decls(shadowLight, "    ")}\n  }\n}\n`,
].join("\n");

const modeBlock = (mode: keyof typeof motion.modes) =>
  block(`[data-motion="${mode}"]`, Object.entries(motion.modes[mode]) as [string, string | number][]);
const motionCss = [
  "/* Movimento: tecla, luz, resposta e revelação. Intensidade via data-motion. */",
  block(":root", [
    ...prefixed("d", motion.duration),
    ...prefixed("ease", motion.easing),
    ["motion-tilt", motion.tilt],
    ["motion-magnet", motion.magnet],
  ]),
  modeBlock("sutil"),
  modeBlock("expressivo"),
  "@media (prefers-reduced-motion: reduce) {\n  :root {\n    --motion-tilt: 0;\n    --motion-magnet: 0;\n  }\n}\n",
].join("\n");

const files: Record<string, string> = {
  "colors.css": colors,
  "typography.css": type,
  "spacing.css": space,
  "radius.css": radii,
  "shadows.css": elevation,
  "motion.css": motionCss,
};

await mkdir(new URL("css/", dist), { recursive: true });
for (const [name, css] of Object.entries(files)) {
  await writeFile(new URL(`css/${name}`, dist), HEADER + css);
}
await writeFile(new URL("tokens.css", dist), HEADER + Object.values(files).join("\n"));

const json = {
  palette,
  gradients,
  themes: { dark: resolveTheme("dark"), light: resolveTheme("light") },
  typography,
  spacing,
  breakpoints,
  radius,
  shadows,
  motion,
};
await writeFile(new URL("tokens.json", dist), `${JSON.stringify(json, null, 2)}\n`);

// Sanidade: toda referência precisa existir na paleta.
for (const t of Object.values(themes)) for (const v of Object.values(t)) resolveColor(v);

console.log(`@luck/tokens: ${Object.keys(files).length} arquivos CSS + tokens.css + tokens.json`);

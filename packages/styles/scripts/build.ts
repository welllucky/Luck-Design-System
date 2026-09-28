// Monta dist/global.css = fontes (auto-hospedadas) + tokens + base.
// As fontes vêm do Fontsource (subconjuntos latin e latin-ext) e são copiadas para dist/fonts.
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { basename, dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const dist = new URL("../dist/", import.meta.url);
const SUBSETS = ["latin", "latin-ext"];
const HEADER = "/* Gerado por @luck/styles — não edite. Fonte: packages/styles/src */\n";

async function fontFaces(pkg: string): Promise<string> {
  const cssPath = require.resolve(`${pkg}/index.css`);
  const css = await readFile(cssPath, "utf8");
  const faces = css.match(/\/\*[^*]*\*\/\s*@font-face\s*{[^}]*}/g) ?? [];
  const kept = faces.filter((f) => SUBSETS.some((s) => new RegExp(`/\\*\\s*[\\w-]+-${s}-wght-normal\\s*\\*/`).test(f)));
  if (!kept.length) throw new Error(`Nenhuma @font-face encontrada em ${pkg}`);
  const out: string[] = [];
  for (const face of kept) {
    // Variáveis do Fontsource usam o nome "<Família> Variable"; o DS referencia a família original.
    let rewritten = face.replace(/font-family:\s*'([^']+) Variable'/, "font-family: '$1'");
    for (const [, url] of face.matchAll(/url\(([^)]+)\)/g)) {
      const clean = url.replace(/['"]/g, "");
      const file = basename(clean);
      await copyFile(join(dirname(cssPath), clean), new URL(`fonts/${file}`, dist));
      rewritten = rewritten.replace(url, `./fonts/${file}`);
    }
    out.push(rewritten);
  }
  return out.join("\n\n");
}

await mkdir(new URL("fonts/", dist), { recursive: true });
const fonts = [
  "/* Manrope (texto) e JetBrains Mono (detalhes técnicos), auto-hospedadas. */",
  await fontFaces("@fontsource-variable/manrope"),
  await fontFaces("@fontsource-variable/jetbrains-mono"),
].join("\n\n");
const tokens = await readFile(require.resolve("@luck/tokens/tokens.css"), "utf8");
const base = await readFile(new URL("../src/base.css", import.meta.url), "utf8");

await writeFile(new URL("fonts.css", dist), `${HEADER}${fonts}\n`);
await writeFile(new URL("base.css", dist), HEADER + base);
await writeFile(new URL("global.css", dist), `${HEADER}${fonts}\n\n${tokens}\n${base}`);
console.log("@luck/styles: global.css, base.css, fonts.css");

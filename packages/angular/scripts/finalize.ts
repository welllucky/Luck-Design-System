// ng-packagr copia o package.json para dist; troca o protocolo workspace:* pela versão real do core.
import { readFile, writeFile } from "node:fs/promises";

const path = new URL("../dist/package.json", import.meta.url);
const manifest = JSON.parse(await readFile(path, "utf8"));
const core = JSON.parse(await readFile(new URL("../../core/package.json", import.meta.url), "utf8"));
manifest.dependencies["@welllucky/luck-core"] = `^${core.version}`;
delete manifest.scripts;
delete manifest.devDependencies;
// Publica-se a partir de dist: aqui o `directory` já não faz sentido, só o registro.
manifest.publishConfig = { registry: manifest.publishConfig?.registry, access: manifest.publishConfig?.access };
await writeFile(path, `${JSON.stringify(manifest, null, 2)}\n`);

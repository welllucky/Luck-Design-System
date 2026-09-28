import { angularOutputTarget, type ValueAccessorConfig } from "@stencil/angular-output-target";
import type { Config } from "@stencil/core";
import { reactOutputTarget } from "@stencil/react-output-target";
import { type ComponentModelConfig, vueOutputTarget } from "@stencil/vue-output-target";

/** Integração com formulários dos frameworks: ngModel/formControl no Angular e v-model no Vue. */
const models = [
  { elements: ["luck-input", "luck-textarea"], event: "luckInput", targetAttr: "value", angularType: "text" },
  { elements: ["luck-select", "luck-radio-group"], event: "luckChange", targetAttr: "value", angularType: "select" },
  { elements: ["luck-checkbox", "luck-switch"], event: "luckChange", targetAttr: "checked", angularType: "boolean" },
] as const;

const valueAccessorConfigs: ValueAccessorConfig[] = models.map((m) => ({
  elementSelectors: [...m.elements],
  event: m.event,
  targetAttr: m.targetAttr,
  type: m.angularType,
}));

const componentModels: ComponentModelConfig[] = models.map((m) => ({
  elements: [...m.elements],
  event: m.event,
  targetAttr: m.targetAttr,
}));

export const config: Config = {
  namespace: "luck",
  taskQueue: "async",
  sourceMap: false,
  outputTargets: [
    { type: "dist", esmLoaderPath: "../loader" },
    {
      type: "dist-custom-elements",
      customElementsExportBehavior: "single-export-module",
      externalRuntime: false,
      generateTypeDeclarations: true,
    },
    { type: "dist-hydrate-script", dir: "dist/hydrate" },
    { type: "docs-custom-elements-manifest", file: "custom-elements.json" },
    { type: "docs-json", file: "dist/docs.json" },
    { type: "docs-readme", footer: "" },
    reactOutputTarget({ outDir: "../react/src/generated", esModules: true }),
    angularOutputTarget({
      componentCorePackage: "@luck/core",
      directivesProxyFile: "../angular/src/generated/components.ts",
      directivesArrayFile: "../angular/src/generated/directives.ts",
      outputType: "standalone",
      valueAccessorConfigs,
      inlineProperties: true,
      booleanAttributes: true,
    }),
    vueOutputTarget({
      componentCorePackage: "@luck/core",
      proxiesFile: "../vue/src/generated/components.ts",
      includeImportCustomElements: true,
      componentModels,
    }),
  ],
  testing: {
    browserHeadless: "shell",
  },
};

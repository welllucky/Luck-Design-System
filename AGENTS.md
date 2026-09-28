# Luck · guia para agentes

Design system do ecossistema WL3. Monorepo pnpm; textos, comentários e documentação em **português brasileiro**.

## Mapa

- `packages/tokens/src/index.ts` — fonte única dos tokens. `scripts/build.ts` gera CSS/JSON (roda com `node`, type stripping).
- `packages/styles/src/base.css` — base do documento e utilitários `.luck-*`. O build junta fontes + tokens + base em `dist/global.css`.
- `packages/core/src/components/luck-*/` — um componente Stencil por pasta (`.tsx` + `.css`). Estilos compartilhados em `packages/core/src/styles/` entram por `@import` (keyframes não atravessam o Shadow DOM: cada componente importa os seus).
- `packages/core/src/icons/registry.ts` — conjunto padrão de ícones Lucide; ícones de marca em `brand.ts`.
- `packages/{react,angular,vue}/src/generated/` — **gerados** pelo build do core; não editar.
- `apps/storybook/stories/` — MDX de fundamentos e histórias (lit `html`). Helpers de Shadow DOM para `play` em `stories/support/dom.ts`.
- `apps/storybook/tests/` — testes de usabilidade (Vitest em navegador real, teclado via Playwright).

## Convenções

- Tags `luck-*`; eventos `luck*` (`luckChange`, `luckInput`, `luckClose`…). Não use `title` nem `animate` como prop (colidem com `HTMLElement`); use `heading` e `motion`.
- Props de lista aceitam array ou JSON (`parseList`).
- Campos de formulário são `formAssociated`; use `setFormValue`/`syncValidity` de `utils/field.ts` (guardados para SSR e testes).
- APIs de navegador (`MutationObserver`, `ResizeObserver`, `document`) precisam de guarda: o core também roda no hydrate/SSR.
- Stateful só o registro de ícones: adaptadores reexportam de `@welllucky/luck-core/components`, não de `@welllucky/luck-core`.
- Âmbar é o único acento; azul só empresas; roxo só conhecimentos. Raio ≈ altura ÷ 10, teto 8 px. Sem emoji.

## Testes (obrigatórios)

**Todo componente novo — e toda mudança de comportamento — entra com testes nas três camadas.** PR sem eles não é aceito.

1. **Unitário** em `packages/core/src/__tests__/` (`newSpecPage`): render, props refletidas, eventos emitidos.
2. **História com `play`** em `apps/storybook/stories/componentes/`: cada variante documentada e as interações principais (clique, digitação, teclado, eventos `luck*`). Toda história passa pela auditoria axe (`a11y: { test: "error" }`); não desligue a regra, corrija o componente ou o token.
3. **Usabilidade** em `apps/storybook/tests/usabilidade.test.ts`: o componente entra no fluxo de teclado (ordem de Tab, Enter/Espaço/setas/Esc), mostra foco visível, tem alvo de toque ≥ 24 × 24 px e passa no axe nos temas escuro **e** claro.

Dicas:

- Testing Library não atravessa Shadow DOM: use `ready`, `part`, `press` e `listen` de `stories/support/dom.ts`.
- Inputs nativos de checkbox/radio ficam escondidos; clique no `label`, como uma pessoa faria.
- Meça tamanhos, cores e anéis de foco com `commands.emulateReducedMotion(true)` para não pegar transições pela metade.
- Contraste é regra de token: ajuste `packages/tokens/src/index.ts` (AA 4.5:1, inclusive sobre fundos tingidos), não o componente.

O pre-commit (lefthook) roda `pnpm test` completo (~20 s): build do core, unitários, histórias e usabilidade.

## Verificação

```sh
pnpm lint && pnpm build && pnpm test && pnpm --filter @welllucky/luck-storybook build
```

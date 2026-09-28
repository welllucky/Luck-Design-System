# Luck · guia para agentes

Design system do ecossistema WL3. Monorepo pnpm; textos, comentários e documentação em **português brasileiro**.

## Mapa

- `packages/tokens/src/index.ts` — fonte única dos tokens. `scripts/build.ts` gera CSS/JSON (roda com `node`, type stripping).
- `packages/styles/src/base.css` — base do documento e utilitários `.luck-*`. O build junta fontes + tokens + base em `dist/global.css`.
- `packages/core/src/components/luck-*/` — um componente Stencil por pasta (`.tsx` + `.css`). Estilos compartilhados em `packages/core/src/styles/` entram por `@import` (keyframes não atravessam o Shadow DOM: cada componente importa os seus).
- `packages/core/src/icons/registry.ts` — conjunto padrão de ícones Lucide; ícones de marca em `brand.ts`.
- `packages/{react,angular,vue}/src/generated/` — **gerados** pelo build do core; não editar.
- `apps/storybook/stories/` — MDX de fundamentos e histórias (lit `html`).

## Convenções

- Tags `luck-*`; eventos `luck*` (`luckChange`, `luckInput`, `luckClose`…). Não use `title` nem `animate` como prop (colidem com `HTMLElement`); use `heading` e `motion`.
- Props de lista aceitam array ou JSON (`parseList`).
- Campos de formulário são `formAssociated`; use `setFormValue`/`syncValidity` de `utils/field.ts` (guardados para SSR e testes).
- APIs de navegador (`MutationObserver`, `ResizeObserver`, `document`) precisam de guarda: o core também roda no hydrate/SSR.
- Stateful só o registro de ícones: adaptadores reexportam de `@luck/core/components`, não de `@luck/core`.
- Âmbar é o único acento; azul só empresas; roxo só conhecimentos. Raio ≈ altura ÷ 10, teto 8 px. Sem emoji.

## Verificação

```sh
pnpm lint && pnpm build && pnpm test && pnpm --filter @luck/storybook build
```

# Luck

Design system do ecossistema **WL3**. Tokens, CSS global e Web Components escritos uma vez em [Stencil](https://stenciljs.com) e consumidos por React, Angular, Vue ou HTML puro, com o [Storybook](https://storybook.js.org) como documentação visual.

A linguagem é a releitura **V4 · Tátil**: botões são teclas que afundam, campos são poços rebaixados, cards são superfícies elevadas com barra de título. Âmbar é o único acento de interface; azul sinaliza empresas e roxo, conhecimentos. Movimento faz parte da linguagem: mola, luz sob o cursor, resposta a cada clique e revelação escalonada.

## Pacotes

| Pacote | Conteúdo |
| --- | --- |
| [`@luck/tokens`](packages/tokens) | Fonte única dos tokens (`src/index.ts`) → CSS (`tokens.css`, `css/*.css`), JS/TS e `tokens.json` |
| [`@luck/styles`](packages/styles) | `global.css`: fontes auto-hospedadas (Manrope, JetBrains Mono) + tokens + base do documento e utilitários `luck-*` |
| [`@luck/core`](packages/core) | 25 Web Components `<luck-*>` com Shadow DOM, formulários nativos (ElementInternals), SSR (`/hydrate`) e `custom-elements.json` |
| [`@luck/react`](packages/react) | Componentes React gerados (`<LuckButton onLuckChange>`) |
| [`@luck/angular`](packages/angular) | Componentes standalone + adaptadores `ngModel` / Reactive Forms |
| [`@luck/vue`](packages/vue) | Componentes Vue 3 com `v-model` |
| [`@luck/assets`](packages/assets) | Logo Ritmo (SVG/PNG), favicons, ícones de app e imagens |
| [`apps/storybook`](apps/storybook) | Documentação: fundamentos, componentes e uso nos frameworks |

`@luck/core`, `@luck/react`, `@luck/angular` e `@luck/vue` são versionados juntos: os adaptadores são gerados a partir da API do core.

## Componentes

| Grupo | Tags |
| --- | --- |
| Ações | `luck-button`, `luck-icon-button` |
| Formulários | `luck-input`, `luck-textarea`, `luck-select`, `luck-checkbox`, `luck-radio-group` + `luck-radio`, `luck-switch` |
| Exibição | `luck-badge`, `luck-tag`, `luck-avatar`, `luck-card`, `luck-icon` |
| Navegação | `luck-navbar`, `luck-tabs` + `luck-tab` |
| Feedback | `luck-dialog`, `luck-toast` (+ `showToast()`), `luck-tooltip` |
| Marca | `luck-logo` |
| Portfólio | `luck-project-card`, `luck-timeline`, `luck-skill-list`, `luck-social-links` |

Cada componente tem um `readme.md` gerado ao lado do código com props, eventos, slots e parts.

## Uso

```css
@import "@luck/styles/global.css";
```

```tsx
// React
import { LuckButton } from "@luck/react";
<LuckButton iconRight="arrow-up-right">Explorar projetos</LuckButton>;
```

```ts
// Angular (standalone)
import { LUCK_COMPONENTS, LUCK_FORMS } from "@luck/angular";
@Component({ imports: [FormsModule, ...LUCK_COMPONENTS, ...LUCK_FORMS], template: `<luck-input label="E-mail" [(ngModel)]="email" />` })
```

```ts
// Qualquer stack com bundler
import { defineCustomElementLuckButton } from "@luck/core/components";
defineCustomElementLuckButton();
```

Temas: escuro por padrão, claro com `data-theme="light"` (ou `auto`) em qualquer escopo. Movimento: `data-motion="sutil|expressivo"`; `prefers-reduced-motion` desliga animações, inclusive dentro do Shadow DOM. Detalhes em **Fundamentos → Uso nos frameworks** no Storybook.

## Desenvolvimento

Requer Node 24 (ou 22.12+) e pnpm 12 (`mise install` configura os dois).

```sh
pnpm install
pnpm build            # tokens → styles → core (gera adaptadores) → react/vue/angular
pnpm test             # testes de spec do Stencil
pnpm lint             # Biome
pnpm storybook        # build + Storybook em http://localhost:6006
pnpm dev              # recompila o core em modo watch
```

- **Não edite** `packages/*/src/generated/`, `packages/core/src/components.d.ts` nem os `readme.md` dos componentes: são gerados pelo `stencil build`. A CI falha se estiverem desatualizados.
- Tokens mudam só em `packages/tokens/src/index.ts`.
- Mudanças publicáveis precisam de changeset: `pnpm changeset`.

### Cadeia de suprimentos

`pnpm-workspace.yaml` bloqueia dependências de fontes exóticas, rebaixamento de confiança (`trustPolicy: no-downgrade`) e versões publicadas há menos de 7 dias (`minimumReleaseAge`). Para atualizar uma dependência para uma versão recém-lançada, espere a janela ou justifique uma exceção explícita no arquivo.

## Publicação

Os pacotes ainda não são publicados. Opções em aberto:

- **GitHub Packages:** exige que o escopo seja o dono do repositório (`@welllucky`) ou uma organização `luck`.
- **npm privado:** criar a organização `@luck` no npm (plano pago para pacotes privados).
- **Workspace local:** consumir via `pnpm link` / `file:` enquanto o ecossistema estiver em poucos repositórios.

## Licença

Uso restrito ao ecossistema WL3. Todos os direitos reservados.

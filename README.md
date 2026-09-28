# Luck

Design system do ecossistema **WL3**. Tokens, CSS global e Web Components escritos uma vez em [Stencil](https://stenciljs.com) e consumidos por React, Angular, Vue ou HTML puro, com o [Storybook](https://storybook.js.org) como documentação visual.

A linguagem é a releitura **V4 · Tátil**: botões são teclas que afundam, campos são poços rebaixados, cards são superfícies elevadas com barra de título. Âmbar é o único acento de interface; azul sinaliza empresas e roxo, conhecimentos. Movimento faz parte da linguagem: mola, luz sob o cursor, resposta a cada clique e revelação escalonada.

## Pacotes

| Pacote | Conteúdo |
| --- | --- |
| [`@welllucky/luck-tokens`](packages/tokens) | Fonte única dos tokens (`src/index.ts`) → CSS (`tokens.css`, `css/*.css`), JS/TS e `tokens.json` |
| [`@welllucky/luck-styles`](packages/styles) | `global.css`: fontes auto-hospedadas (Manrope, JetBrains Mono) + tokens + base do documento e utilitários `luck-*` |
| [`@welllucky/luck-core`](packages/core) | 25 Web Components `<luck-*>` com Shadow DOM, formulários nativos (ElementInternals), SSR (`/hydrate`) e `custom-elements.json` |
| [`@welllucky/luck-react`](packages/react) | Componentes React gerados (`<LuckButton onLuckChange>`) |
| [`@welllucky/luck-angular`](packages/angular) | Componentes standalone + adaptadores `ngModel` / Reactive Forms |
| [`@welllucky/luck-vue`](packages/vue) | Componentes Vue 3 com `v-model` |
| [`apps/storybook`](apps/storybook) | Documentação: fundamentos, componentes e uso nos frameworks |

`@welllucky/luck-core`, `@welllucky/luck-react`, `@welllucky/luck-angular` e `@welllucky/luck-vue` são versionados juntos: os adaptadores são gerados a partir da API do core.

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
@import "@welllucky/luck-styles/global.css";
```

```tsx
// React
import { LuckButton } from "@welllucky/luck-react";
<LuckButton iconRight="arrow-up-right">Explorar projetos</LuckButton>;
```

```ts
// Angular (standalone)
import { LUCK_COMPONENTS, LUCK_FORMS } from "@welllucky/luck-angular";
@Component({ imports: [FormsModule, ...LUCK_COMPONENTS, ...LUCK_FORMS], template: `<luck-input label="E-mail" [(ngModel)]="email" />` })
```

```ts
// Qualquer stack com bundler
import { defineCustomElementLuckButton } from "@welllucky/luck-core/components";
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
- Commits seguem [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `feat!:`/`BREAKING CHANGE:`…): é deles que o `nx release` deriva a versão de cada pacote. Veja **Publicação**.

### Deploy do Storybook (Docker)

A imagem constrói o Storybook e o serve como site estático com nginx sem root, na porta 8080. O contexto de build é a raiz do monorepo.

```sh
docker build -t luck-storybook .
docker run --rm -p 8080:8080 luck-storybook
```

- Healthcheck em `/healthz`.
- `assets/` com cache imutável de 1 ano; HTML e JSON com `no-cache`, então cada deploy aparece na hora.
- ~95 MB. Funciona em qualquer host de contêiner (Fly.io, Railway, Cloud Run, VPS com Docker/Coolify).
- A CI constrói a imagem a cada push (sem publicar).

### Cadeia de suprimentos

`pnpm-workspace.yaml` bloqueia dependências de fontes exóticas, rebaixamento de confiança (`trustPolicy: no-downgrade`) e versões publicadas há menos de 7 dias (`minimumReleaseAge`). Para atualizar uma dependência para uma versão recém-lançada, espere a janela ou justifique uma exceção explícita no arquivo.

## Publicação

Os pacotes são publicados no **GitHub Packages** (registro npm do GitHub), com a mesma visibilidade privada do repositório.

O versionamento é do [Nx Release](https://nx.dev/features/manage-releases), a partir de **Conventional Commits** — sem changeset manual. A cada push na `main`, o workflow **Release**:

1. Olha, por pacote, os commits desde a última tag (`fix:` → patch, `feat:` → minor, `feat!:`/rodapé `BREAKING CHANGE:` → major). Commit que não toca arquivos do pacote não conta.
2. Sem nada relevante, não faz nada. Havendo mudança, builda, escreve o `CHANGELOG.md` do pacote, cria o commit `chore(release): publica <pacote> <versão>` com as tags, publica no GitHub Packages e cria a GitHub Release.

`@welllucky/luck-core`, `luck-react`, `luck-angular` e `luck-vue` formam um **grupo fixo** (`nx.json` → `release.groups.core`): sobem sempre juntos, na maior versão exigida por qualquer um deles. `luck-tokens` e `luck-styles` versionam de forma independente. O `luck-angular` é publicado a partir de `packages/angular/dist`.

### Comandos úteis

```sh
# Ver o que seria versionado/publicado agora, sem alterar nada (equivalente a `pnpm release:dry`)
nx release --dry-run

# O mesmo, só para um grupo — nomes em nx.json → release.groups (core, tokens, styles)
nx release --dry-run -g core

# O mesmo, só para um pacote específico
nx release --dry-run -p @welllucky/luck-tokens

# Forçar um bump específico, ignorando o que os commits sugerem (ex.: patch manual)
nx release patch -g styles --dry-run

# Versionar e gerar changelog sem publicar (revisar antes de soltar)
nx release --skip-publish

# Publicar de novo o que já foi versionado, sem versionar outra vez
nx release publish --dry-run

# Ver a configuração de release já resolvida (grupos, tag pattern, etc.)
nx release --printConfig

# Primeira publicação de um pacote novo (sem tag anterior para comparar)
nx release -p @welllucky/luck-novo-pacote --first-release --dry-run
```

Rodar qualquer um desses **sem** `--dry-run` versiona/publica de verdade — normalmente isso é papel do workflow **Release** na CI, não da máquina local. Use local só para conferir (`--dry-run`) ou numa emergência (`--skip-publish` para revisar antes, depois `nx release publish` manual).

## Instalação nos apps

Os pacotes são privados: o app precisa de um token com permissão `read:packages`.

1. Crie um token em **GitHub → Settings → Developer settings → Personal access tokens** com o escopo `read:packages`.
2. No projeto consumidor, crie um `.npmrc` (e **não** coloque o token nele):

   ```ini
   @welllucky:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NPM_TOKEN}
   ```

3. Exporte o token e instale:

   ```sh
   export NPM_TOKEN=ghp_...   # token com read:packages
   pnpm add @welllucky/luck-styles @welllucky/luck-react   # ou luck-angular / luck-vue / luck-core
   ```

**Na CI do app** (GitHub Actions): em **Package settings → Manage Actions access** de cada pacote, dê acesso de leitura ao repositório do app. Aí o `GITHUB_TOKEN` do workflow basta:

```yaml
- uses: actions/setup-node@v4
  with:
    registry-url: https://npm.pkg.github.com
    scope: "@welllucky"
- run: pnpm install --frozen-lockfile
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Licença

Uso restrito ao ecossistema WL3. Todos os direitos reservados.

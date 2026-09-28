# @luck/assets

Ativos estáticos da marca. Não há build: os arquivos são publicados como estão.

| Caminho | Conteúdo |
| --- | --- |
| `logo/svg/<forma>/` e `logo/png/<forma>/` | `symbol`, `symbol-small` (abaixo de 24 px), `horizontal`, `stacked`, `wordmark`, `signature` × `dark`, `light`, `on-amber`, `amber`, `white`, `black`; sufixo `-bg` inclui o fundo |
| `logo/svg/app/`, `logo/png/app/` | Ícone de app tátil (âmbar e tinta), iOS 1024, Android adaptativo, PWA maskable |
| `logo/favicon/` | `favicon.ico`, `favicon.svg` (segue claro/escuro), PNGs, `site.webmanifest` e `head.html` com as tags |
| `logo/wl3-symbol-*.svg` | Símbolo avulso nas variantes de tom |
| `images/` | Fundo do hero, retratos recortados e ilustrações |

```ts
import symbolUrl from "@luck/assets/logo/svg/symbol/wl3-symbol-dark.svg";
```

Para favicons, copie `logo/favicon/*` para a raiz pública do site e cole `head.html` no `<head>`.

## Regras da marca

- Não espelhar, girar ou distorcer. Nunca azul ou roxo no símbolo.
- Área de proteção: 1 t (18 % do lado do símbolo) em volta.
- Tamanho mínimo: símbolo 16 px, horizontal 96 px. Abaixo de 24 px use `symbol-small`.
- Em interfaces, prefira o componente `<luck-logo>` de `@luck/core`, que acompanha o tema.

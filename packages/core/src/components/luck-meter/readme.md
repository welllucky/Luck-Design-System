# luck-meter



<!-- Auto Generated Below -->


## Overview

Medidor de uma grandeza num intervalo conhecido (cobertura, aderência, orçamento). Não é progresso de uma
tarefa: usa o `<meter>` nativo, com o texto do valor em `aria-valuetext`. O rótulo fica visível acima da
barra; com `compact`, só o leitor de tela o lê.

`accent` (âmbar) é o padrão; `company` (azul) só para empresas; `knowledge` (roxo) só para conhecimentos;
`danger` para estouro ou erro; `neutral` para o que não tem família.

## Properties

| Property             | Attribute    | Description                                                             | Type                                                            | Default     |
| -------------------- | ------------ | ----------------------------------------------------------------------- | --------------------------------------------------------------- | ----------- |
| `compact`            | `compact`    | Esconde rótulo e valor visíveis; a barra mantém o nome acessível.       | `boolean`                                                       | `false`     |
| `label` _(required)_ | `label`      | Nome acessível e rótulo visível do medidor.                             | `string`                                                        | `undefined` |
| `max`                | `max`        |                                                                         | `number`                                                        | `100`       |
| `tone`               | `tone`       |                                                                         | `"accent" \| "company" \| "danger" \| "knowledge" \| "neutral"` | `"accent"`  |
| `value`              | `value`      |                                                                         | `number`                                                        | `0`         |
| `valueText`          | `value-text` | Texto do valor (ex.: `7 / 9`, `R$ 3,20 de R$ 10`). Padrão: porcentagem. | `string \| undefined`                                           | `undefined` |


## Shadow Parts

| Part      | Description  |
| --------- | ------------ |
| `"track"` | O `<meter>`. |


----------------------------------------------



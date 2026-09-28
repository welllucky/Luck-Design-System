# luck-radio



<!-- Auto Generated Below -->


## Overview

Opção de um `luck-radio-group`. O grupo controla `checked`, o nome e a navegação por setas.

## Properties

| Property             | Attribute   | Description                                                        | Type                  | Default     |
| -------------------- | ----------- | ------------------------------------------------------------------ | --------------------- | ----------- |
| `checked`            | `checked`   |                                                                    | `boolean`             | `false`     |
| `disabled`           | `disabled`  |                                                                    | `boolean`             | `false`     |
| `focusable`          | `focusable` | Definido pelo grupo: só a opção ativa entra na ordem de tabulação. | `boolean`             | `true`      |
| `label`              | `label`     |                                                                    | `string \| undefined` | `undefined` |
| `value` _(required)_ | `value`     |                                                                    | `string`              | `undefined` |


## Events

| Event             | Description                                       | Type                              |
| ----------------- | ------------------------------------------------- | --------------------------------- |
| `luckRadioSelect` | Evento interno consumido pelo `luck-radio-group`. | `CustomEvent<{ value: string; }>` |


## Methods

### `setFocus() => Promise<void>`



#### Returns

Type: `Promise<void>`




## Slots

| Slot | Description                               |
| ---- | ----------------------------------------- |
|      | Rótulo (alternativa ao atributo `label`). |


----------------------------------------------



# luck-tabs



<!-- Auto Generated Below -->


## Overview

Abas com tecla deslizante: o indicador corre em mola até a aba ativa e o painel entra pelo lado
da navegação. Setas, Home e End navegam.

## Properties

| Property    | Attribute    | Description                    | Type                  | Default     |
| ----------- | ------------ | ------------------------------ | --------------------- | ----------- |
| `fullWidth` | `full-width` | Abas dividem a largura toda.   | `boolean`             | `false`     |
| `value`     | `value`      | Aba ativa. Padrão: a primeira. | `string \| undefined` | `undefined` |


## Events

| Event        | Description | Type                              |
| ------------ | ----------- | --------------------------------- |
| `luckChange` |             | `CustomEvent<{ value: string; }>` |


## Slots

| Slot | Description    |
| ---- | -------------- |
|      | Os `luck-tab`. |


## Shadow Parts

| Part        | Description        |
| ----------- | ------------------ |
| `"tablist"` | O trilho das abas. |


----------------------------------------------



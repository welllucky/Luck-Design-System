# luck-message



<!-- Auto Generated Below -->


## Overview

Mensagem de uma conversa, como as de um assistente. A pergunta (`from="user"`) alinha à direita; a resposta
(`from="assistant"`) alinha à esquerda e mostra, abaixo do texto, as fontes citadas no slot `citations`
(links, `luck-tag` ou `luck-badge`). O autor é lido antes do texto por leitores de tela; ponha a conversa
inteira numa lista ou num contêiner com `role="log"` para que respostas novas sejam anunciadas.

## Properties

| Property         | Attribute         | Description                                                        | Type                    | Default       |
| ---------------- | ----------------- | ------------------------------------------------------------------ | ----------------------- | ------------- |
| `author`         | `author`          | Nome do autor, lido antes da mensagem (ex.: `Você`, `Assistente`). | `string`                | `""`          |
| `citationsLabel` | `citations-label` | Rótulo do grupo de fontes.                                         | `string`                | `"Fontes"`    |
| `from`           | `from`            |                                                                    | `"assistant" \| "user"` | `"assistant"` |


## Slots

| Slot          | Description                                           |
| ------------- | ----------------------------------------------------- |
|               | Texto da mensagem (parágrafos, listas).               |
| `"citations"` | Fontes da resposta; aparece só em `from="assistant"`. |


## Shadow Parts

| Part       | Description          |
| ---------- | -------------------- |
| `"bubble"` | O balão da mensagem. |


----------------------------------------------



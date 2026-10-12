import { Component, Element, Host, h, Prop, State } from "@stencil/core";

/**
 * Mensagem de uma conversa, como as de um assistente. A pergunta (`from="user"`) alinha à direita; a resposta
 * (`from="assistant"`) alinha à esquerda e mostra, abaixo do texto, as fontes citadas no slot `citations`
 * (links, `luck-tag` ou `luck-badge`). O autor é lido antes do texto por leitores de tela; ponha a conversa
 * inteira numa lista ou num contêiner com `role="log"` para que respostas novas sejam anunciadas.
 *
 * @slot - Texto da mensagem (parágrafos, listas).
 * @slot citations - Fontes da resposta; aparece só em `from="assistant"`.
 * @part bubble - O balão da mensagem.
 */
@Component({
  tag: "luck-message",
  styleUrl: "luck-message.css",
  shadow: true,
})
export class LuckMessage {
  @Element() el!: HTMLLuckMessageElement;

  @Prop({ reflect: true }) from: "user" | "assistant" = "assistant";
  /** Nome do autor, lido antes da mensagem (ex.: `Você`, `Assistente`). */
  @Prop() author = "";
  /** Rótulo do grupo de fontes. */
  @Prop() citationsLabel = "Fontes";

  @State() hasCitations = false;

  componentWillLoad() {
    this.syncCitations();
  }

  private syncCitations = () => {
    this.hasCitations = Array.from(this.el.children).some((c) => c.getAttribute("slot") === "citations");
  };

  render() {
    return (
      <Host>
        <div class="bubble" part="bubble">
          {this.author && <span class="sr-only">{this.author}: </span>}
          <div class="body">
            <slot />
          </div>
          {this.from === "assistant" && (
            // biome-ignore lint/a11y/useSemanticElements: os itens chegam pelo slot; o grupo só os nomeia.
            <div class="citations" role="group" aria-label={this.citationsLabel} hidden={!this.hasCitations}>
              <slot name="citations" onSlotchange={this.syncCitations} />
            </div>
          )}
        </div>
      </Host>
    );
  }
}

import { Component, Host, h, Prop } from "@stencil/core";

/**
 * Aba de um `luck-tabs`. O conteúdo é o painel mostrado quando a aba está ativa.
 *
 * @slot - Conteúdo do painel.
 */
@Component({
  tag: "luck-tab",
  styleUrl: "luck-tab.css",
  shadow: true,
})
export class LuckTab {
  @Prop({ reflect: true }) value!: string;
  /** Texto do botão da aba. */
  @Prop({ reflect: true }) label!: string;
  @Prop({ reflect: true }) disabled = false;
  /** Definido pelo `luck-tabs`. */
  @Prop({ reflect: true }) active = false;

  render() {
    return (
      <Host role="tabpanel" aria-label={this.label} tabIndex={this.active ? 0 : -1}>
        <slot />
      </Host>
    );
  }
}

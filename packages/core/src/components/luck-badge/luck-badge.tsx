import { Component, Host, h, Prop } from "@stencil/core";

/**
 * Selo curto de status. `accent` para disponibilidade e destaques; `company` (azul) só para empresas;
 * `knowledge` (roxo) só para conhecimentos; `danger` para erro.
 *
 * @slot - Texto do selo.
 */
@Component({
  tag: "luck-badge",
  styleUrl: "luck-badge.css",
  shadow: true,
})
export class LuckBadge {
  @Prop({ reflect: true }) tone: "neutral" | "accent" | "company" | "knowledge" | "danger" = "neutral";
  /** Ícone Lucide antes do texto. */
  @Prop() icon?: string;
  /** Ponto que "respira" antes do texto. */
  @Prop() dot = false;

  render() {
    return (
      <Host>
        {this.dot && <span class="dot" aria-hidden="true" />}
        {this.icon && <luck-icon name={this.icon} size={13} />}
        <slot />
      </Host>
    );
  }
}

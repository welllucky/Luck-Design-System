import { Component, Host, h } from "@stencil/core";

/**
 * Marcador mono para tecnologias, categorias e metadados.
 *
 * @slot - Texto da tag.
 */
@Component({
  tag: "luck-tag",
  styleUrl: "luck-tag.css",
  shadow: true,
})
export class LuckTag {
  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}

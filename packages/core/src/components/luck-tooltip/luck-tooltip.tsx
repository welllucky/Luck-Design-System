import { Component, Host, h, Prop } from "@stencil/core";
import { cx } from "../../utils/utils";

/**
 * Dica curta no hover e no foco, com atraso de 250 ms e entrada em mola.
 *
 * @slot - Elemento que recebe a dica.
 */
@Component({
  tag: "luck-tooltip",
  styleUrl: "luck-tooltip.css",
  shadow: true,
})
export class LuckTooltip {
  /** Texto da dica. */
  @Prop() label!: string;
  @Prop({ reflect: true }) side: "top" | "bottom" = "top";

  render() {
    return (
      <Host>
        <slot />
        <span role="tooltip" class={cx("tip", this.side === "bottom" && "tip--bottom")}>
          {this.label}
        </span>
      </Host>
    );
  }
}

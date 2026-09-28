import { Component, Host, h, Prop, State, Watch } from "@stencil/core";
import { getIcon, type IconNode, loadIcon, onIconsChange } from "../../icons/registry";

/**
 * Ícone Lucide (traço 1.75, tamanho 16). O nome segue o kebab-case do Lucide: `arrow-up-right`.
 * Ícones fora do conjunto padrão entram com `registerIcons` ou `setIconLoader`.
 */
@Component({
  tag: "luck-icon",
  styleUrl: "luck-icon.css",
  shadow: true,
})
export class LuckIcon {
  /** Nome do ícone em kebab-case (`arrow-up-right`, `circle-check`). */
  @Prop({ reflect: true }) name!: string;
  /** Tamanho em px. */
  @Prop() size = 16;
  /** Espessura do traço. */
  @Prop() strokeWidth = 1.75;
  /** Texto para leitores de tela. Sem ele, o ícone é decorativo (`aria-hidden`). */
  @Prop() label?: string;

  @State() node?: IconNode;

  private off?: () => void;

  connectedCallback() {
    this.off = onIconsChange(() => this.resolve());
  }

  disconnectedCallback() {
    this.off?.();
  }

  componentWillLoad() {
    return this.resolve();
  }

  @Watch("name")
  async resolve() {
    this.node = getIcon(this.name) ?? (await loadIcon(this.name));
  }

  render() {
    const a11y = this.label ? { role: "img", "aria-label": this.label } : { "aria-hidden": "true" };
    return (
      <Host {...a11y} style={{ width: `${this.size}px`, height: `${this.size}px` }}>
        {this.node && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={this.size}
            height={this.size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width={this.strokeWidth}
            stroke-linecap="round"
            stroke-linejoin="round"
            part="svg"
            aria-hidden="true"
          >
            {this.node.map(([tag, attrs]) => h(tag, { ...attrs }))}
          </svg>
        )}
      </Host>
    );
  }
}

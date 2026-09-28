import { Component, Event, type EventEmitter, Host, h, Method, Prop, State } from "@stencil/core";
import { cx } from "../../utils/utils";

/**
 * Botão tecla só com ícone. O `label` vira nome acessível e dica no hover.
 * Com `confirm-icon`, o ícone troca por 1,5 s após o clique (ex.: copiar → ✓).
 *
 * @part control - O `<button>` ou `<a>` interno.
 */
@Component({
  tag: "luck-icon-button",
  styleUrl: "luck-icon-button.css",
  shadow: { delegatesFocus: true },
})
export class LuckIconButton {
  /** Ícone Lucide. */
  @Prop() icon!: string;
  /** Nome acessível e texto da dica. Obrigatório. */
  @Prop() label!: string;
  @Prop({ reflect: true }) variant: "primary" | "secondary" | "ghost" = "secondary";
  @Prop({ reflect: true }) size: "sm" | "md" | "lg" = "md";
  /** Mostra o `label` como dica no hover e no foco. */
  @Prop() tooltip = true;
  /** Ícone mostrado por 1,5 s após o clique. */
  @Prop() confirmIcon?: string;
  /** Texto anunciado na confirmação. */
  @Prop() confirmLabel = "Pronto";
  @Prop({ reflect: true }) disabled = false;
  @Prop() href?: string;
  @Prop() target?: string;
  @Prop() rel?: string;
  /** Repassado como `aria-expanded` (menus, painéis). */
  @Prop() expanded?: boolean;

  /** Emitido quando a confirmação aparece. */
  @Event() luckConfirm!: EventEmitter<void>;

  @State() confirmed = false;

  private timer?: ReturnType<typeof setTimeout>;
  private control?: HTMLElement;

  disconnectedCallback() {
    clearTimeout(this.timer);
  }

  @Method()
  async setFocus() {
    this.control?.focus();
  }

  private onClick = (e: MouseEvent) => {
    if (this.disabled) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    if (!this.confirmIcon) return;
    this.confirmed = true;
    this.luckConfirm.emit();
    clearTimeout(this.timer);
    this.timer = setTimeout(() => (this.confirmed = false), 1500);
  };

  render() {
    const px = this.size === "sm" ? 15 : 16;
    const cls = cx("key", `key--${this.variant}`, `key--${this.size}`, "key--icon", this.confirmed && "is-swapped");
    const inner = [
      <span class={cx("swap", this.confirmIcon && "swap--two")}>
        <luck-icon name={this.icon} size={px} />
        {this.confirmIcon && <luck-icon class="confirm" name={this.confirmIcon} size={px} />}
      </span>,
      this.tooltip && (
        <span class="tip tip--hover" aria-hidden="true">
          {this.label}
        </span>
      ),
      this.confirmIcon && (
        <span class={cx("tip", this.confirmed && "is-shown")} aria-live="polite">
          {this.confirmed ? this.confirmLabel : ""}
        </span>
      ),
    ];
    const common = {
      class: cls,
      part: "control",
      ref: (el?: HTMLElement) => (this.control = el),
      "aria-label": this.label,
      "aria-expanded": this.expanded === undefined ? undefined : String(this.expanded),
      onClick: this.onClick,
    };
    return (
      <Host>
        {this.href ? (
          <a
            {...common}
            href={this.disabled ? undefined : this.href}
            target={this.target}
            rel={this.rel}
            aria-disabled={this.disabled ? "true" : undefined}
          >
            {inner}
          </a>
        ) : (
          <button {...common} type="button" disabled={this.disabled}>
            {inner}
          </button>
        )}
      </Host>
    );
  }
}

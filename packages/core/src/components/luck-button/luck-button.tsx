import {
  AttachInternals,
  Component,
  Element,
  Event,
  type EventEmitter,
  Host,
  h,
  Method,
  Prop,
  State,
} from "@stencil/core";
import { cx, motionVar } from "../../utils/utils";

const ICON_MOTION: Record<string, "fly" | "drop"> = {
  "arrow-up-right": "fly",
  "arrow-right": "fly",
  send: "fly",
  download: "drop",
  "arrow-down": "drop",
};

const hasContent = (nodes: Node[]) => nodes.some((n) => n.nodeType === Node.ELEMENT_NODE || !!n.textContent?.trim());

/**
 * Botão tátil (tecla): afunda ao pressionar e volta com mola. `primary` para a ação principal
 * (uma por área), `secondary` para alternativas e `ghost` para baixa ênfase.
 *
 * @slot - Rótulo do botão.
 * @part control - O `<button>` ou `<a>` interno.
 */
@Component({
  tag: "luck-button",
  styleUrl: "luck-button.css",
  shadow: { delegatesFocus: true },
  formAssociated: true,
})
export class LuckButton {
  @Element() el!: HTMLLuckButtonElement;
  @AttachInternals() internals!: ElementInternals;

  @Prop({ reflect: true }) variant: "primary" | "secondary" | "ghost" = "primary";
  @Prop({ reflect: true }) size: "sm" | "md" | "lg" = "md";
  /** Ícone Lucide antes do rótulo. */
  @Prop() iconLeft?: string;
  /** Ícone Lucide depois do rótulo. Setas "voam" no hover; download "cai". */
  @Prop() iconRight?: string;
  /** Troca o conteúdo por um spinner, mantendo a largura. */
  @Prop({ reflect: true }) loading = false;
  /** Troca o conteúdo por um ✓ desenhado. */
  @Prop({ reflect: true }) success = false;
  @Prop({ reflect: true }) disabled = false;
  /** Puxa o botão em direção ao cursor (intensidade via `--motion-magnet`). */
  @Prop() magnetic = false;
  /** Ocupa toda a largura disponível. */
  @Prop({ reflect: true }) fullWidth = false;
  @Prop() type: "button" | "submit" | "reset" = "button";
  /** Com `href`, renderiza um link com a mesma aparência. */
  @Prop() href?: string;
  @Prop() target?: string;
  @Prop() rel?: string;
  @Prop() download?: string;

  /** Emitido ao receber foco. */
  @Event() luckFocus!: EventEmitter<void>;
  /** Emitido ao perder foco. */
  @Event() luckBlur!: EventEmitter<void>;

  @State() ripple?: { x: number; y: number; k: number };
  @State() hasLabel = true;

  private control?: HTMLElement;

  /** Move o foco para o botão. */
  @Method()
  async setFocus() {
    this.control?.focus();
  }

  private get inactive() {
    return this.disabled || this.loading;
  }

  private onPointerDown = (e: PointerEvent) => {
    if (this.inactive || !this.control) return;
    const r = this.control.getBoundingClientRect();
    this.ripple = { x: e.clientX - r.left, y: e.clientY - r.top, k: Date.now() };
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.magnetic) return;
    const m = motionVar(this.el, "--motion-magnet");
    const r = this.el.getBoundingClientRect();
    this.el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * m}px,${(e.clientY - r.top - r.height / 2) * m}px)`;
  };

  private onPointerLeave = () => {
    if (this.magnetic) this.el.style.transform = "";
  };

  private onClick = (e: MouseEvent) => {
    if (this.inactive) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    if (this.href) return;
    const form = this.internals.form;
    if (!form) return;
    if (this.type === "submit") form.requestSubmit();
    if (this.type === "reset") form.reset();
  };

  componentWillLoad() {
    this.hasLabel = hasContent(Array.from(this.el.childNodes));
  }

  private onSlotChange = (e: Event) => {
    this.hasLabel = hasContent((e.target as HTMLSlotElement).assignedNodes({ flatten: true }));
  };

  private icon(name: string | undefined) {
    if (!name) return null;
    const motion = ICON_MOTION[name];
    return (
      <span class={cx("icon", motion && `icon--${motion}`)}>
        <luck-icon name={name} size={this.size === "sm" ? 15 : 16} />
      </span>
    );
  }

  render() {
    const cls = cx(
      "key",
      `key--${this.variant}`,
      `key--${this.size}`,
      this.loading && "is-loading",
      this.success && "is-success",
      this.fullWidth && "key--block",
    );
    const content = [
      this.icon(this.iconLeft),
      <span class={cx("label", !this.hasLabel && "label--empty")}>
        <slot onSlotchange={this.onSlotChange} />
      </span>,
      this.icon(this.iconRight),
      <span class="spinner" aria-hidden="true" />,
      <svg class="check" viewBox="0 0 18 18" aria-hidden="true">
        <path d="M4 9.5l3.2 3.2L14 5.5" />
      </svg>,
      this.ripple && (
        <span
          key={this.ripple.k}
          class="ripple"
          style={{ left: `${this.ripple.x}px`, top: `${this.ripple.y}px` }}
          onAnimationEnd={() => (this.ripple = undefined)}
        />
      ),
    ];
    const common = {
      class: cls,
      part: "control",
      ref: (el?: HTMLElement) => (this.control = el),
      "aria-busy": this.loading ? "true" : undefined,
      onPointerDown: this.onPointerDown,
      onClick: this.onClick,
      onFocus: () => this.luckFocus.emit(),
      onBlur: () => this.luckBlur.emit(),
    };
    return (
      <Host onPointerMove={this.onPointerMove} onPointerLeave={this.onPointerLeave}>
        {this.href ? (
          <a
            {...common}
            href={this.inactive ? undefined : this.href}
            target={this.target}
            rel={this.rel}
            download={this.download}
            aria-disabled={this.inactive ? "true" : undefined}
            role={this.inactive ? "link" : undefined}
          >
            {content}
          </a>
        ) : (
          <button {...common} type={this.type} disabled={this.disabled}>
            {content}
          </button>
        )}
      </Host>
    );
  }
}

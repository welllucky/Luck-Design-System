import { Component, Element, Event, type EventEmitter, Host, h, Method, Prop, State, Watch } from "@stencil/core";
import { cx } from "../../utils/utils";

/**
 * Diálogo modal sobre `<dialog>` nativo (foco preso, Esc, camada superior). Fecha por Esc, clique
 * no fundo ou no botão ×; em todos os casos emite `luckClose` e define `open = false`.
 *
 * @slot - Corpo do diálogo.
 * @slot actions - Botões de ação, alinhados à direita.
 * @part panel - O painel do diálogo.
 */
@Component({
  tag: "luck-dialog",
  styleUrl: "luck-dialog.css",
  shadow: true,
})
export class LuckDialog {
  @Element() el!: HTMLLuckDialogElement;

  /** Abre ou fecha o diálogo. */
  @Prop({ mutable: true, reflect: true }) open = false;
  /** Título do diálogo (também é o nome acessível). */
  @Prop() heading?: string;
  /** Texto de apoio abaixo do título. */
  @Prop() description?: string;
  /** Largura máxima do painel em px. */
  @Prop() width = 480;
  /** Nome acessível do botão de fechar. */
  @Prop() closeLabel = "Fechar";
  /** Impede fechar pelo fundo e por Esc (use para confirmações obrigatórias). */
  @Prop() persistent = false;

  /** Emitido quando o usuário pede para fechar (Esc, fundo ou ×). */
  @Event() luckClose!: EventEmitter<{ reason: "escape" | "backdrop" | "button" | "method" }>;

  @State() closing = false;
  @State() hasActions = false;

  private dialog?: HTMLDialogElement;
  private timer?: ReturnType<typeof setTimeout>;

  componentWillLoad() {
    this.hasActions = Array.from(this.el.children).some((c) => c.getAttribute("slot") === "actions");
  }

  componentDidLoad() {
    if (this.open) this.dialog?.showModal();
  }

  disconnectedCallback() {
    clearTimeout(this.timer);
  }

  @Watch("open")
  onOpenChange(open: boolean) {
    const d = this.dialog;
    if (!d) return;
    clearTimeout(this.timer);
    if (open) {
      this.closing = false;
      if (!d.open) d.showModal();
      return;
    }
    if (!d.open) return;
    this.closing = true;
    this.timer = setTimeout(() => {
      d.close();
      this.closing = false;
    }, 220);
  }

  /** Abre o diálogo. */
  @Method()
  async show() {
    this.open = true;
  }

  /** Fecha o diálogo. */
  @Method()
  async hide() {
    this.requestClose("method");
  }

  private requestClose(reason: "escape" | "backdrop" | "button" | "method") {
    if (!this.open) return;
    this.open = false;
    this.luckClose.emit({ reason });
  }

  private onCancel = (e: Event) => {
    e.preventDefault();
    if (!this.persistent) this.requestClose("escape");
  };

  private onClick = (e: MouseEvent) => {
    if (e.target === this.dialog && !this.persistent) this.requestClose("backdrop");
  };

  render() {
    return (
      <Host>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: clique no fundo; o teclado fecha por Esc (evento cancel). */}
        <dialog
          ref={(el) => (this.dialog = el)}
          class={cx(this.closing && "is-closing")}
          aria-label={this.heading}
          onCancel={this.onCancel}
          onClick={this.onClick}
        >
          <div class="panel" part="panel" style={{ width: `min(${this.width}px, calc(100vw - 32px))` }}>
            <div class="head">
              <div>
                {this.heading && <h2 class="title">{this.heading}</h2>}
                {this.description && <p class="desc">{this.description}</p>}
              </div>
              <luck-icon-button
                icon="x"
                label={this.closeLabel}
                variant="ghost"
                size="sm"
                tooltip={false}
                onClick={() => this.requestClose("button")}
              />
            </div>
            <div class="body">
              <slot />
            </div>
            <div class={cx("actions", !this.hasActions && "actions--empty")}>
              <slot
                name="actions"
                onSlotchange={(e) => (this.hasActions = (e.target as HTMLSlotElement).assignedElements().length > 0)}
              />
            </div>
          </div>
        </dialog>
      </Host>
    );
  }
}

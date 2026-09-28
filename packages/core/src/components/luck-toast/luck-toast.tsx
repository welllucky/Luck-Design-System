import { Component, Event, type EventEmitter, Host, h, Method, Prop, State } from "@stencil/core";
import { cx } from "../../utils/utils";

/**
 * Aviso curto e humano: "Mensagem enviada · Respondo em até 2 dias úteis." A barra inferior conta o
 * tempo e pausa no hover. Para empilhar avisos na tela, use `showToast()` de `@luck/core`.
 *
 * @slot action - Ação opcional (ex.: `<luck-button size="sm" variant="ghost">Desfazer</luck-button>`).
 */
@Component({
  tag: "luck-toast",
  styleUrl: "luck-toast.css",
  shadow: true,
})
export class LuckToast {
  @Prop() heading!: string;
  @Prop() description?: string;
  /** Ícone Lucide. */
  @Prop() icon = "circle-check";
  @Prop({ reflect: true }) tone: "accent" | "danger" | "company" | "knowledge" = "accent";
  /** Tempo até fechar sozinho, em ms. `0` mantém aberto. */
  @Prop() duration = 4000;
  @Prop() closeLabel = "Fechar";

  /** Emitido quando a animação de saída termina. */
  @Event() luckClose!: EventEmitter<void>;

  @State() leaving = false;

  /** Fecha o aviso com a animação de saída. */
  @Method()
  async dismiss() {
    this.leaving = true;
  }

  private onAnimationEnd = (e: AnimationEvent) => {
    if (this.leaving && e.animationName === "luck-toast-out") this.luckClose.emit();
  };

  render() {
    return (
      <Host role={this.tone === "danger" ? "alert" : "status"}>
        <div class={cx("toast", this.leaving && "is-leaving")} onAnimationEnd={this.onAnimationEnd}>
          <span class="icon">
            <luck-icon name={this.icon} size={16} />
          </span>
          <div class="text">
            <b>{this.heading}</b>
            {this.description && <small>{this.description}</small>}
          </div>
          <slot name="action" />
          <button type="button" class="close" aria-label={this.closeLabel} onClick={() => this.dismiss()}>
            <luck-icon name="x" size={14} />
          </button>
          {this.duration > 0 && (
            <i
              class="bar"
              style={{ animationDuration: `${this.duration}ms` }}
              onAnimationEnd={(e) => {
                e.stopPropagation();
                this.dismiss();
              }}
            />
          )}
        </div>
      </Host>
    );
  }
}

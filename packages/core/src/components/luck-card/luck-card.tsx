import { Component, Element, Host, h, Prop, State } from "@stencil/core";
import { cx, motionVar } from "../../utils/utils";

/**
 * Superfície elevada com barra de título (índice âmbar, rótulo mono, dica e três pontos).
 * A luz segue o cursor; com `tilt`, o card inclina em 3D.
 *
 * @slot - Conteúdo do card.
 * @part card - A superfície.
 * @part bar - A barra de título.
 * @part body - A área de conteúdo.
 */
@Component({
  tag: "luck-card",
  styleUrl: "luck-card.css",
  shadow: true,
})
export class LuckCard {
  @Element() el!: HTMLLuckCardElement;

  /** Rótulo da barra de título (mono, maiúsculo). */
  @Prop() heading?: string;
  /** Índice âmbar na barra: `01`. */
  @Prop() index?: string;
  /** Dica à direita da barra. */
  @Prop() hint?: string;
  /** Força mostrar/ocultar a barra. Padrão: aparece quando há `heading` ou `index`. */
  @Prop() bar?: boolean;
  /** Luz âmbar sob o cursor. */
  @Prop() interactive = true;
  /** Inclinação 3D (intensidade via `--motion-tilt`). */
  @Prop({ reflect: true }) tilt = false;
  /** Aplica o padding padrão (22 px) ao conteúdo. */
  @Prop() padded = true;

  @State() moving = false;

  private card?: HTMLElement;

  private onMove = (e: PointerEvent) => {
    const el = this.card;
    if (!el || (!this.interactive && !this.tilt)) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    if (!this.tilt) return;
    const t = motionVar(el, "--motion-tilt");
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${px * t}deg`);
    el.style.setProperty("--rx", `${-py * t}deg`);
    // Paralaxe para conteúdo que queira acompanhar (ex.: mídia do ProjectCard).
    el.style.setProperty("--px", `${px * -12}px`);
    el.style.setProperty("--py", `${py * -12}px`);
    if (!this.moving) this.moving = true;
  };

  private onLeave = () => {
    const el = this.card;
    if (!el || !this.tilt) return;
    this.moving = false;
    for (const p of ["--rx", "--ry"]) el.style.setProperty(p, "0deg");
    for (const p of ["--px", "--py"]) el.style.setProperty(p, "0px");
  };

  render() {
    const showBar = this.bar ?? !!(this.heading || this.index);
    return (
      <Host>
        <div
          ref={(el) => (this.card = el)}
          part="card"
          class={cx(
            "card",
            this.interactive && "card--light",
            this.tilt && "card--tilt",
            this.moving && "is-moving",
            this.padded && "card--padded",
          )}
          onPointerMove={this.onMove}
          onPointerLeave={this.onLeave}
        >
          {showBar && (
            <div class="bar" part="bar">
              {this.index && <b>{this.index}</b>}
              {this.heading && <span>{this.heading}</span>}
              {this.hint && <small>{this.hint}</small>}
              <i aria-hidden="true" />
            </div>
          )}
          <div class="body" part="body">
            <slot />
          </div>
        </div>
      </Host>
    );
  }
}

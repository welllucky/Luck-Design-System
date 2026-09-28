import { Component, Host, h, Prop } from "@stencil/core";
import { cx } from "../../utils/utils";

const STD = ["M0 61.8H18V82H30V100H0Z", "M34 38.2H52V82H64V100H34Z", "M68 0H86V82H100V100H68Z"];
const SM = ["M0 61.8H20V80H29V100H0Z", "M36 38.2H56V80H65V100H36Z", "M72 0H92V80H100V100H72Z"];
const LLL = ["M0 23H15V61H22V76H0Z", "M26 12H41V61H48V76H26Z", "M52 0H67V61H74V76H52Z"];

const TONES = {
  default: ["var(--logo-ink)", "var(--logo-accent)"],
  mono: ["currentColor", "currentColor"],
  "on-accent": ["var(--amber-ink)", "var(--amber-ink)"],
  accent: ["var(--amber-400)", "var(--amber-400)"],
} as const;

/**
 * Logo WL3 "Ritmo": três Ls crescendo (0,382 · 0,618 · 1) sobre uma base comum, o último em âmbar.
 * Não espelhar, girar ou distorcer; nunca azul ou roxo. Mínimo: símbolo 16 px, horizontal 96 px.
 */
@Component({
  tag: "luck-logo",
  styleUrl: "luck-logo.css",
  shadow: true,
})
export class LuckLogo {
  /** `horizontal` é a assinatura principal. */
  @Prop({ reflect: true }) variant: "symbol" | "horizontal" | "stacked" | "signature" | "wordmark" | "app-icon" =
    "symbol";
  /** Altura do símbolo em px (no wordmark, o corpo da fonte). */
  @Prop() size = 32;
  @Prop({ reflect: true }) tone: "default" | "mono" | "on-accent" | "accent" = "default";
  /** Versão reduzida do símbolo. Padrão: automática abaixo de 24 px. */
  @Prop() reduced?: boolean;
  /** `rise`: entrada em mola. `press`: tecla no hover (usado na Navbar). */
  @Prop({ reflect: true }) motion: "none" | "rise" | "press" = "none";
  /** Nome na assinatura. */
  @Prop() name = "Wellington Braga";
  /** Linha de apoio na assinatura. Vazio para omitir. */
  @Prop() tagline = "Código · Design · UX";
  /** Nome acessível. */
  @Prop() label = "welllucky";

  private mark(size: number, reduced: boolean, ink: string, accent: string, keyShadow?: string) {
    const d = reduced ? SM : STD;
    return (
      <svg
        class="mark"
        viewBox={keyShadow ? "0 0 100 108" : "0 0 100 100"}
        width={size}
        height={keyShadow ? size * 1.08 : size}
        aria-hidden="true"
      >
        {keyShadow && (
          <g transform="translate(0 8)" fill={keyShadow}>
            {d.map((p) => (
              <path d={p} />
            ))}
          </g>
        )}
        {d.map((p, i) => (
          <path class="l" d={p} fill={i === 2 ? accent : ink} />
        ))}
      </svg>
    );
  }

  private wordmark(fontSize: number, ink: string, accent: string) {
    return (
      <span class="word" style={{ fontSize: `${fontSize}px`, color: ink }}>
        we
        <svg viewBox="0 0 74 76" aria-hidden="true" class="lll">
          {LLL.map((p, i) => (
            <path d={p} fill={i === 2 ? accent : ink} />
          ))}
        </svg>
        ucky
      </span>
    );
  }

  render() {
    const [ink, accent] = TONES[this.tone] ?? TONES.default;
    const size = this.size;
    const small = this.reduced ?? size < 24;
    let content: unknown;
    let style: Record<string, string> = {};

    switch (this.variant) {
      case "app-icon":
        style = {
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: `${Math.min(8, Math.max(2, size * 0.1))}px`,
          background: "var(--amber-400)",
          boxShadow: `inset 0 ${Math.max(1, size * 0.016)}px 0 var(--amber-300), 0 ${Math.max(2, size * 0.042)}px 0 var(--amber-700)`,
        };
        content = this.mark(size * 0.5, size < 48, "var(--amber-ink)", "var(--amber-ink)", "var(--amber-600)");
        break;
      case "wordmark":
        content = this.wordmark(size, ink, accent);
        break;
      case "horizontal":
        style = { gap: `${size * 0.318}px` };
        content = [this.mark(size, small, ink, accent), this.wordmark(size * 0.909, ink, accent)];
        break;
      case "stacked":
        style = { flexDirection: "column", gap: `${size * 0.222}px` };
        content = [this.mark(size, small, ink, accent), this.wordmark(size * 0.417, ink, accent)];
        break;
      case "signature": {
        const def = this.tone === "default";
        style = { gap: `${size * 0.35}px` };
        content = [
          this.mark(size, small, ink, accent),
          <span class="sig" style={{ paddingLeft: `${size * 0.35}px`, gap: `${size * 0.125}px` }}>
            <span class="sig__name" style={{ fontSize: `${size * 0.45}px`, color: def ? "var(--fg)" : ink }}>
              {this.name}
            </span>
            {this.tagline && (
              <span
                class="sig__tagline"
                style={{ fontSize: `${Math.max(9, size * 0.25)}px`, color: def ? "var(--fg-muted)" : ink }}
              >
                {this.tagline}
              </span>
            )}
          </span>,
        ];
        break;
      }
      default:
        content = this.mark(size, small, ink, accent);
    }

    return (
      <Host role="img" aria-label={this.label} style={style} class={cx(this.motion !== "none" && `is-${this.motion}`)}>
        {content}
      </Host>
    );
  }
}

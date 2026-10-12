import { Component, Host, h, Prop } from "@stencil/core";

/**
 * Medidor de uma grandeza num intervalo conhecido (cobertura, aderência, orçamento). Não é progresso de uma
 * tarefa: usa o `<meter>` nativo, com o texto do valor em `aria-valuetext`. O rótulo fica visível acima da
 * barra; com `compact`, só o leitor de tela o lê.
 *
 * `accent` (âmbar) é o padrão; `company` (azul) só para empresas; `knowledge` (roxo) só para conhecimentos;
 * `danger` para estouro ou erro; `neutral` para o que não tem família.
 *
 * @part track - O `<meter>`.
 */
@Component({
  tag: "luck-meter",
  styleUrl: "luck-meter.css",
  shadow: true,
})
export class LuckMeter {
  /** Nome acessível e rótulo visível do medidor. */
  @Prop() label!: string;
  @Prop() value = 0;
  @Prop() max = 100;
  /** Texto do valor (ex.: `7 / 9`, `R$ 3,20 de R$ 10`). Padrão: porcentagem. */
  @Prop() valueText?: string;
  @Prop({ reflect: true }) tone: "accent" | "company" | "knowledge" | "danger" | "neutral" = "accent";
  /** Esconde rótulo e valor visíveis; a barra mantém o nome acessível. */
  @Prop({ reflect: true }) compact = false;

  render() {
    const max = this.max > 0 ? this.max : 100;
    const value = Math.min(Math.max(Number(this.value) || 0, 0), max);
    const text = this.valueText || `${Math.round((value / max) * 100)}%`;
    return (
      <Host>
        {!this.compact && (
          <div class="label" aria-hidden="true">
            <span>{this.label}</span>
            <span class="value">{text}</span>
          </div>
        )}
        <meter part="track" aria-label={this.label} aria-valuetext={text} min={0} max={max} value={value}>
          {text}
        </meter>
      </Host>
    );
  }
}

import { Component, Event, type EventEmitter, Host, h, Prop } from "@stencil/core";
import { safeHref } from "../../utils/utils";

/**
 * Métrica em destaque: título curto com ícone Lucide, número com unidade e legenda. Com `href`, o bloco do
 * título à legenda vira um link só, e o nome acessível junta título, número, unidade e legenda na ordem de
 * leitura; destinos que não sejam caminho relativo, `http` ou `https` são descartados. `pending` marca o que
 * ainda não existe (borda tracejada, número esmaecido).
 *
 * @slot - Conteúdo extra abaixo da métrica, fora do link (ex.: um `luck-meter`).
 * @slot badge - Selo à direita do título (ex.: um `luck-badge`).
 * @part card - O bloco da métrica (`<a>` com `href`, `<div>` sem).
 */
@Component({
  tag: "luck-stat",
  styleUrl: "luck-stat.css",
  shadow: true,
})
export class LuckStat {
  @Prop() heading!: string;
  /** Número ou valor principal, já formatado. */
  @Prop() value = "";
  /** Unidade depois do valor (ex.: `projetos`). */
  @Prop() unit = "";
  /** Legenda abaixo do valor. */
  @Prop() caption = "";
  /** Ícone Lucide antes do título. */
  @Prop() icon?: string;
  /** Destino da métrica: caminho relativo, `http` ou `https`. */
  @Prop() href?: string;
  /** Marca uma métrica que ainda não está disponível. */
  @Prop({ reflect: true }) pending = false;

  /** Clique no link. Cancelável: `preventDefault()` impede a navegação (ex.: roteamento SPA). */
  @Event({ cancelable: true }) luckOpen!: EventEmitter<{ href: string }>;

  private onOpen = (e: MouseEvent) => {
    const href = safeHref(this.href);
    if (!href) return;
    const ev = this.luckOpen.emit({ href });
    if (ev.defaultPrevented) e.preventDefault();
  };

  render() {
    const href = safeHref(this.href);
    const body = [
      <span class="head">
        {this.icon && <luck-icon name={this.icon} size={16} />}
        <span class="heading">{this.heading}</span>
        <span class="badge">
          <slot name="badge" />
        </span>
      </span>,
      <span class="value">
        {this.value}
        {this.unit && <small> {this.unit}</small>}
      </span>,
      this.caption && <span class="caption">{this.caption}</span>,
    ];
    return (
      <Host>
        {href ? (
          <a class="card" part="card" href={href} onClick={this.onOpen}>
            {body}
          </a>
        ) : (
          <div class="card" part="card">
            {body}
          </div>
        )}
        <div class="extra">
          <slot />
        </div>
      </Host>
    );
  }
}

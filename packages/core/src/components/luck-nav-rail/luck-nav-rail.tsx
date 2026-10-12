import { Component, Event, type EventEmitter, Host, h, Prop } from "@stencil/core";
import { cx, parseList } from "../../utils/utils";

export type NavRailItem = { label: string; href?: string; icon?: string; value?: string };

/**
 * Trilho de navegação de primeiro nível: ícone (20 px) e rótulo curto por seção do produto. A seção aberta
 * leva `aria-current="page"` e o traço âmbar. Com `orientation="auto"`, o trilho é vertical e vira barra
 * horizontal em telas de até 700 px; `vertical` e `horizontal` fixam o arranjo.
 *
 * Para navegação SPA, chame `preventDefault()` em `luckNavigate` e roteie você mesmo.
 *
 * @slot start - Marca ou atalho no topo do trilho vertical (some na barra horizontal).
 * @slot end - Ações no pé do trilho vertical, como busca e conta (some na barra horizontal).
 * @part rail - O `<nav>`.
 * @part item - Cada link.
 */
@Component({
  tag: "luck-nav-rail",
  styleUrl: "luck-nav-rail.css",
  shadow: true,
})
export class LuckNavRail {
  /** Seções: `[{ label, href, icon?, value? }]`. Via atributo, em JSON. */
  @Prop() items: NavRailItem[] | string = [];
  /** `value` (ou `href`) da seção aberta. */
  @Prop() active?: string;
  /** Nome acessível do `<nav>`; deve diferir do nome de outras navegações da página. */
  @Prop() label = "Navegação principal";
  /** `auto` é vertical e vira horizontal em telas de até 700 px. */
  @Prop({ reflect: true }) orientation: "auto" | "vertical" | "horizontal" = "auto";

  /** Clique em uma seção. Cancelável: `preventDefault()` impede a navegação nativa. */
  @Event({ cancelable: true }) luckNavigate!: EventEmitter<{ value: string; href?: string }>;

  private go(item: NavRailItem, e: MouseEvent) {
    const value = item.value ?? item.href ?? item.label;
    const ev = this.luckNavigate.emit({ value, href: item.href });
    if (ev.defaultPrevented) e.preventDefault();
  }

  render() {
    const items = parseList<NavRailItem>(this.items);
    return (
      <Host>
        <nav aria-label={this.label} part="rail">
          <div class="start">
            <slot name="start" />
          </div>
          <ul class="items">
            {items.map((item) => {
              const v = item.value ?? item.href ?? item.label;
              const isActive = v === this.active;
              return (
                <li>
                  <a
                    href={item.href ?? "#"}
                    class={cx("item", isActive && "is-active")}
                    part="item"
                    aria-current={isActive ? "page" : undefined}
                    onClick={(e) => this.go(item, e)}
                  >
                    {item.icon && <luck-icon name={item.icon} size={20} />}
                    <span class="label">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <div class="end">
            <slot name="end" />
          </div>
        </nav>
      </Host>
    );
  }
}

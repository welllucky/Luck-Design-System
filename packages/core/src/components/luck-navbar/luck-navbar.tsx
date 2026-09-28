import { Component, Element, Event, type EventEmitter, Host, h, Prop, State } from "@stencil/core";
import { getTheme, setTheme, type Theme } from "../../utils/theme";
import { cx, parseList } from "../../utils/utils";

export type NavLink = { label: string; href?: string; value?: string };

/**
 * Barra de navegação: logo que "pressiona" no hover, links com traço âmbar, troca de tema em
 * círculo e CTA. Abaixo de 760 px vira menu.
 *
 * Para navegação SPA, chame `preventDefault()` em `luckNavigate` e roteie você mesmo.
 *
 * @slot brand - Substitui a logo.
 * @slot actions - Ações extras antes do CTA.
 */
@Component({
  tag: "luck-navbar",
  styleUrls: ["../../styles/key.css", "luck-navbar.css"],
  shadow: true,
})
export class LuckNavbar {
  @Element() el!: HTMLLuckNavbarElement;

  /** Links: `[{ label, href, value? }]`. Via atributo, em JSON. */
  @Prop() links: NavLink[] | string = [];
  /** `value` (ou `href`) do link ativo. */
  @Prop() active?: string;
  /** Link da logo. */
  @Prop() brandHref = "/";
  @Prop() ctaLabel?: string;
  @Prop() ctaHref?: string;
  @Prop() ctaIcon = "arrow-up-right";
  /** Tema controlado. Sem ele, o botão troca o `data-theme` do documento. */
  @Prop() theme?: Theme;
  @Prop() showThemeToggle = true;
  @Prop() menuLabel = "Abrir menu";
  @Prop() closeMenuLabel = "Fechar menu";

  /** Clique em um link. Cancelável: `preventDefault()` impede a navegação nativa. */
  @Event({ cancelable: true }) luckNavigate!: EventEmitter<{ value: string; href?: string }>;
  /** Pedido de troca de tema. Cancelável: `preventDefault()` impede a troca automática. */
  @Event({ cancelable: true }) luckThemeChange!: EventEmitter<{ theme: Theme }>;
  /** Clique no CTA. */
  @Event() luckCta!: EventEmitter<void>;

  @State() open = false;
  @State() localTheme: Theme = "dark";

  componentWillLoad() {
    if (typeof document !== "undefined") this.localTheme = getTheme(this.el);
  }

  private go(link: NavLink, e: MouseEvent) {
    const value = link.value ?? link.href ?? link.label;
    const ev = this.luckNavigate.emit({ value, href: link.href });
    if (ev.defaultPrevented) e.preventDefault();
    this.open = false;
  }

  private toggleTheme = (e: MouseEvent) => {
    const current = this.theme ?? this.localTheme;
    const next: Theme = current === "dark" ? "light" : "dark";
    const ev = this.luckThemeChange.emit({ theme: next });
    if (ev.defaultPrevented || this.theme) return;
    this.localTheme = setTheme(next, e.currentTarget as Element);
  };

  render() {
    const links = parseList<NavLink>(this.links);
    const theme = this.theme ?? this.localTheme;
    return (
      <Host>
        <nav class={cx("nav", this.open && "is-open")}>
          <a class="brand" href={this.brandHref} aria-label="Início">
            <slot name="brand">
              <luck-logo variant="horizontal" size={24} motion="press" />
            </slot>
          </a>
          <div class="links">
            {links.map((l) => {
              const v = l.value ?? l.href ?? l.label;
              const isActive = v === this.active;
              return (
                <a
                  href={l.href ?? "#"}
                  class={cx("link", isActive && "is-active")}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(e) => this.go(l, e)}
                >
                  {l.label}
                </a>
              );
            })}
          </div>
          <div class="actions">
            <slot name="actions" />
            {this.showThemeToggle && (
              <button
                type="button"
                class={cx("key", "key--ghost", "key--sm", "key--icon", theme === "dark" && "is-swapped")}
                aria-label={theme === "dark" ? "Usar tema claro" : "Usar tema escuro"}
                onClick={this.toggleTheme}
              >
                <span class="swap swap--two">
                  <luck-icon name="sun" size={15} />
                  <luck-icon name="moon" size={15} />
                </span>
              </button>
            )}
            {this.ctaLabel && (
              <luck-button
                class="cta"
                size="sm"
                iconRight={this.ctaIcon}
                href={this.ctaHref}
                onClick={() => this.luckCta.emit()}
              >
                {this.ctaLabel}
              </luck-button>
            )}
            <luck-icon-button
              class="menu"
              icon={this.open ? "x" : "menu"}
              label={this.open ? this.closeMenuLabel : this.menuLabel}
              variant="ghost"
              size="sm"
              tooltip={false}
              expanded={this.open}
              onClick={() => (this.open = !this.open)}
            />
          </div>
        </nav>
      </Host>
    );
  }
}

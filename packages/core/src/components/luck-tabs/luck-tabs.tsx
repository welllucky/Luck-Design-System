import { Component, Element, Event, type EventEmitter, Host, h, Prop, State, Watch } from "@stencil/core";
import { childrenByTag, cx } from "../../utils/utils";

type TabInfo = { value: string; label: string; disabled: boolean };

/**
 * Abas com tecla deslizante: o indicador corre em mola até a aba ativa e o painel entra pelo lado
 * da navegação. Setas, Home e End navegam.
 *
 * @slot - Os `luck-tab`.
 * @part tablist - O trilho das abas.
 */
@Component({
  tag: "luck-tabs",
  styleUrl: "luck-tabs.css",
  shadow: true,
})
export class LuckTabs {
  @Element() el!: HTMLLuckTabsElement;

  /** Aba ativa. Padrão: a primeira. */
  @Prop({ mutable: true, reflect: true }) value?: string;
  /** Abas dividem a largura toda. */
  @Prop({ reflect: true }) fullWidth = false;

  @Event() luckChange!: EventEmitter<{ value: string }>;

  @State() tabs: TabInfo[] = [];
  @State() ind?: { left: number; width: number };
  @State() ready = false;

  private list?: HTMLElement;
  private ro?: ResizeObserver;
  private mo?: MutationObserver;
  private dir = 0;

  private get panels(): HTMLLuckTabElement[] {
    return childrenByTag<HTMLLuckTabElement>(this.el, "luck-tab");
  }

  connectedCallback() {
    if (typeof MutationObserver === "undefined") return;
    this.mo = new MutationObserver(() => this.collect());
    this.mo.observe(this.el, { childList: true, subtree: true, attributeFilter: ["label", "value", "disabled"] });
  }

  disconnectedCallback() {
    this.mo?.disconnect();
    this.ro?.disconnect();
  }

  componentWillLoad() {
    this.collect();
  }

  componentDidLoad() {
    if (typeof ResizeObserver !== "undefined" && this.list) {
      this.ro = new ResizeObserver(() => this.place());
      this.ro.observe(this.list);
    }
    if (typeof document !== "undefined") document.fonts?.ready.then(() => this.place());
    setTimeout(() => (this.ready = true), 60);
  }

  componentDidRender() {
    this.place();
  }

  private collect() {
    this.tabs = this.panels.map((p) => ({ value: p.value, label: p.label, disabled: p.disabled }));
    if (this.value === undefined || !this.tabs.some((t) => t.value === this.value)) {
      this.value = this.tabs.find((t) => !t.disabled)?.value;
    }
    this.syncPanels();
  }

  @Watch("value")
  syncPanels() {
    for (const p of this.panels) {
      p.active = p.value === this.value;
      p.style.setProperty("--dir", String(this.dir * 24));
    }
  }

  private place() {
    const el = this.list?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!el) return;
    const next = { left: el.offsetLeft, width: el.offsetWidth };
    if (this.ind?.left !== next.left || this.ind?.width !== next.width) this.ind = next;
  }

  private select(value: string, focus = false) {
    if (value !== this.value) {
      const a = this.tabs.findIndex((t) => t.value === this.value);
      const b = this.tabs.findIndex((t) => t.value === value);
      this.dir = b > a ? 1 : -1;
      this.value = value;
      this.luckChange.emit({ value });
    }
    if (!focus) return;
    for (const b of Array.from(this.list?.querySelectorAll<HTMLElement>("[data-value]") ?? [])) {
      if (b.dataset.value === value) b.focus();
    }
  }

  private onKey = (e: KeyboardEvent) => {
    const enabled = this.tabs.filter((t) => !t.disabled);
    const i = enabled.findIndex((t) => t.value === this.value);
    let next: TabInfo | undefined;
    if (e.key === "ArrowRight") next = enabled[(i + 1) % enabled.length];
    if (e.key === "ArrowLeft") next = enabled[(i - 1 + enabled.length) % enabled.length];
    if (e.key === "Home") next = enabled[0];
    if (e.key === "End") next = enabled[enabled.length - 1];
    if (!next) return;
    e.preventDefault();
    this.select(next.value, true);
  };

  render() {
    return (
      <Host>
        <div
          ref={(el) => (this.list = el)}
          role="tablist"
          part="tablist"
          class={cx("tabs", this.ready && "is-ready")}
          onKeyDown={this.onKey}
        >
          {this.ind && (
            <span class="ind" style={{ left: `${this.ind.left}px`, width: `${this.ind.width}px` }} aria-hidden="true" />
          )}
          {this.tabs.map((t) => {
            const selected = t.value === this.value;
            return (
              <button
                type="button"
                role="tab"
                class="tab"
                data-value={t.value}
                aria-selected={String(selected)}
                tabIndex={selected ? 0 : -1}
                disabled={t.disabled}
                onClick={() => this.select(t.value)}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <slot onSlotchange={() => this.collect()} />
      </Host>
    );
  }
}

import { Component, Event, type EventEmitter, Host, h, Prop } from "@stencil/core";
import { cx, parseList } from "../../utils/utils";

export type SkillItem = { title: string; icon?: string; stack?: string; summary?: string };

/**
 * Lista de conhecimentos em sanfona (uma aberta por vez). Ícones em roxo, o sinal de conhecimento.
 */
@Component({
  tag: "luck-skill-list",
  styleUrl: "luck-skill-list.css",
  shadow: true,
})
export class LuckSkillList {
  /** Itens: `[{ title, icon?, stack?, summary? }]`. Via atributo, em JSON. */
  @Prop() items: SkillItem[] | string = [];
  /** Índice aberto. `-1` fecha todos. */
  @Prop({ mutable: true }) open = 0;

  @Event() luckToggle!: EventEmitter<{ index: number }>;

  private toggle(i: number) {
    this.open = this.open === i ? -1 : i;
    this.luckToggle.emit({ index: this.open });
  }

  render() {
    const items = parseList<SkillItem>(this.items);
    return (
      <Host>
        {items.map((it, i) => {
          const isOpen = this.open === i;
          return (
            <div class={cx("item", isOpen && "is-open")}>
              <button
                type="button"
                class="head"
                aria-expanded={String(isOpen)}
                aria-controls={`panel-${i}`}
                onClick={() => this.toggle(i)}
              >
                <span class="icon">
                  <luck-icon name={it.icon || "sparkles"} size={16} />
                </span>
                <span class="title">{it.title}</span>
                <luck-icon class="chev" name="chevron-down" size={16} />
              </button>
              <section class="panel" id={`panel-${i}`} aria-label={it.title}>
                <div>
                  {it.stack && <p class="stack">{it.stack}</p>}
                  {it.summary && <p class="summary">{it.summary}</p>}
                </div>
              </section>
            </div>
          );
        })}
      </Host>
    );
  }
}

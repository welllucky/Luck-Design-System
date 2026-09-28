import { Component, Host, h, Prop, State } from "@stencil/core";
import { cx, parseList } from "../../utils/utils";

export type TimelineItem = {
  title: string;
  company?: string;
  period?: string;
  description?: string;
  /** Ponto atual (âmbar). Padrão: o primeiro item. */
  active?: boolean;
};

/** Trajetória: linha que se desenha e marcos que sobem escalonados. Empresa em azul. */
@Component({
  tag: "luck-timeline",
  styleUrl: "luck-timeline.css",
  shadow: true,
})
export class LuckTimeline {
  /** Itens: `[{ title, company?, period?, description?, active? }]`. Via atributo, em JSON. */
  @Prop() items: TimelineItem[] | string = [];

  @State() shown = false;

  componentDidLoad() {
    requestAnimationFrame(() => (this.shown = true));
  }

  render() {
    const items = parseList<TimelineItem>(this.items);
    return (
      <Host>
        <ol class={cx("timeline", this.shown && "is-in")}>
          {items.map((it, i) => (
            <li class={cx("item", (it.active ?? i === 0) && "is-current")} style={{ "--i": String(i) }}>
              <span class="dot" aria-hidden="true" />
              <div>
                <b class="title">{it.title}</b>
                <span class="meta">
                  {it.company && <em>{it.company}</em>}
                  {it.company && it.period && " · "}
                  {it.period}
                </span>
                {it.description && <p class="desc">{it.description}</p>}
              </div>
            </li>
          ))}
        </ol>
      </Host>
    );
  }
}

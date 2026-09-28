import { Component, Event, type EventEmitter, Host, h, Prop } from "@stencil/core";
import { parseList } from "../../utils/utils";

/**
 * Card de projeto do portfólio: mídia com paralaxe, tags mono, empresa em azul e link com seta que voa.
 * O card inclina em 3D sob o cursor.
 */
@Component({
  tag: "luck-project-card",
  styleUrl: "luck-project-card.css",
  shadow: true,
})
export class LuckProjectCard {
  @Prop() heading!: string;
  @Prop() description?: string;
  /** Tecnologias: array, JSON ou lista separada por vírgulas. */
  @Prop() tags: string[] | string = [];
  /** Empresa (sinalizada em azul). */
  @Prop() company?: string;
  @Prop() period?: string;
  /** URL da imagem de capa. */
  @Prop() image?: string;
  /** `contain` centraliza a marca a 58 % da altura; `cover` preenche. */
  @Prop() imageFit: "contain" | "cover" = "contain";
  @Prop() imageBg = "#F3F3F3";
  @Prop() href = "#";
  @Prop() linkLabel = "Ver projeto";
  /** Índice na barra do card: `01`. */
  @Prop() index?: string;

  /** Clique no link. Cancelável: `preventDefault()` impede a navegação (ex.: abrir um diálogo). */
  @Event({ cancelable: true }) luckOpen!: EventEmitter<{ href: string }>;

  private onOpen = (e: MouseEvent) => {
    const ev = this.luckOpen.emit({ href: this.href });
    if (ev.defaultPrevented) e.preventDefault();
  };

  render() {
    const tags = parseList<string>(this.tags);
    return (
      <Host>
        <luck-card tilt padded={false} index={this.index} heading={this.index ? "Projeto" : undefined}>
          {this.image && (
            <div class="media" style={{ background: this.imageBg }}>
              <i
                style={{
                  backgroundImage: `url(${this.image})`,
                  backgroundSize: this.imageFit === "cover" ? "cover" : "auto 58%",
                }}
              />
            </div>
          )}
          <div class="body">
            {tags.length > 0 && (
              <div class="tags">
                {tags.map((t) => (
                  <luck-tag>{t}</luck-tag>
                ))}
              </div>
            )}
            <h3 class="title">{this.heading}</h3>
            {this.description && <p class="desc">{this.description}</p>}
            <div class="foot">
              {this.company && (
                <span class="company">
                  <luck-icon name="building-2" size={14} />
                  {this.company}
                  {this.period && <em>· {this.period}</em>}
                </span>
              )}
              <a class="link" href={this.href} onClick={this.onOpen}>
                {this.linkLabel}
                <luck-icon name="arrow-up-right" size={15} />
              </a>
            </div>
          </div>
        </luck-card>
      </Host>
    );
  }
}

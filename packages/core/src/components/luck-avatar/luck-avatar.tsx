import { Component, Host, h, Prop } from "@stencil/core";

/** Avatar circular: foto ou iniciais, com ponto de disponibilidade opcional. */
@Component({
  tag: "luck-avatar",
  styleUrl: "luck-avatar.css",
  shadow: true,
})
export class LuckAvatar {
  /** URL da foto. Sem ela, mostra as iniciais de `name`. */
  @Prop() src?: string;
  /** Nome da pessoa (texto alternativo e iniciais). */
  @Prop() name = "";
  /** Diâmetro em px. */
  @Prop() size = 40;
  /** Mostra o ponto âmbar de disponibilidade. */
  @Prop() status = false;
  /** Texto do status para leitores de tela. */
  @Prop() statusLabel = "Disponível";

  render() {
    const initials = this.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();
    return (
      <Host
        style={{ width: `${this.size}px`, height: `${this.size}px`, fontSize: `${Math.round(this.size * 0.36)}px` }}
      >
        {this.src ? (
          <img src={this.src} alt={this.name} part="image" />
        ) : (
          <span role="img" aria-label={this.name}>
            {initials}
          </span>
        )}
        {this.status && <span class="dot status" role="status" aria-label={this.statusLabel} />}
      </Host>
    );
  }
}

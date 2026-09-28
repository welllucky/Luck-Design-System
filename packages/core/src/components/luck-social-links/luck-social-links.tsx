import { Component, Host, h, Prop } from "@stencil/core";
import { parseList } from "../../utils/utils";

export type SocialLink = {
  network: "github" | "linkedin" | "instagram" | "youtube" | "behance" | "dribbble" | "x" | "mail" | (string & {});
  href: string;
  label?: string;
};

const NETWORKS: Record<string, [icon: string, name: string]> = {
  github: ["github", "GitHub"],
  linkedin: ["linkedin", "LinkedIn"],
  instagram: ["instagram", "Instagram"],
  youtube: ["youtube", "YouTube"],
  behance: ["palette", "Behance"],
  dribbble: ["dribbble", "Dribbble"],
  x: ["twitter", "X"],
  mail: ["mail", "E-mail"],
};

/** Redes sociais como teclas de ícone (com dica) ou botões com rótulo. */
@Component({
  tag: "luck-social-links",
  styleUrl: "luck-social-links.css",
  shadow: true,
})
export class LuckSocialLinks {
  /** Links: `[{ network, href, label? }]`. Via atributo, em JSON. */
  @Prop() links: SocialLink[] | string = [];
  @Prop() variant: "icon" | "button" = "icon";
  @Prop() size: "sm" | "md" | "lg" = "md";

  render() {
    const links = parseList<SocialLink>(this.links);
    return (
      <Host>
        {links.map((l) => {
          const [icon, name] = NETWORKS[l.network] ?? ["link", l.network];
          const label = l.label ?? name;
          const external = !l.href.startsWith("mailto:");
          const target = external ? "_blank" : undefined;
          const rel = external ? "noreferrer" : undefined;
          return this.variant === "icon" ? (
            <luck-icon-button icon={icon} label={label} href={l.href} size={this.size} target={target} rel={rel} />
          ) : (
            <luck-button
              variant="secondary"
              size={this.size === "md" ? "sm" : this.size}
              iconLeft={icon}
              href={l.href}
              target={target}
              rel={rel}
            >
              {label}
            </luck-button>
          );
        })}
      </Host>
    );
  }
}

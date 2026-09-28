import { Component, Element, Event, type EventEmitter, Host, h, Method, Prop } from "@stencil/core";

/**
 * Opção de um `luck-radio-group`. O grupo controla `checked`, o nome e a navegação por setas.
 *
 * @slot - Rótulo (alternativa ao atributo `label`).
 */
@Component({
  tag: "luck-radio",
  styleUrls: ["../../styles/check.css", "luck-radio.css"],
  shadow: { delegatesFocus: true },
})
export class LuckRadio {
  @Element() el!: HTMLLuckRadioElement;

  @Prop() value!: string;
  @Prop() label?: string;
  @Prop({ mutable: true, reflect: true }) checked = false;
  @Prop({ reflect: true }) disabled = false;
  /** Definido pelo grupo: só a opção ativa entra na ordem de tabulação. */
  @Prop({ mutable: true }) focusable = true;

  /** Evento interno consumido pelo `luck-radio-group`. */
  @Event({ bubbles: true, composed: true }) luckRadioSelect!: EventEmitter<{ value: string }>;

  private control?: HTMLInputElement;

  @Method()
  async setFocus() {
    this.control?.focus();
  }

  private onChange = () => {
    this.luckRadioSelect.emit({ value: this.value });
  };

  render() {
    return (
      <Host>
        <label class="check">
          <input
            ref={(el) => (this.control = el)}
            type="radio"
            checked={this.checked}
            disabled={this.disabled}
            tabIndex={this.focusable ? 0 : -1}
            onChange={this.onChange}
          />
          <span class="box" aria-hidden="true" />
          <span class="label">
            <slot>{this.label}</slot>
          </span>
        </label>
      </Host>
    );
  }
}

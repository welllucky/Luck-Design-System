import { AttachInternals, Component, Event, type EventEmitter, Host, h, Method, Prop, Watch } from "@stencil/core";
import { setFormValue } from "../../utils/field";

/**
 * Caixa de seleção tátil: o ✓ é desenhado ao marcar.
 *
 * @slot - Rótulo (alternativa ao atributo `label`).
 */
@Component({
  tag: "luck-checkbox",
  styleUrls: ["../../styles/check.css", "luck-checkbox.css"],
  shadow: { delegatesFocus: true },
  formAssociated: true,
})
export class LuckCheckbox {
  @AttachInternals() internals!: ElementInternals;

  @Prop() label?: string;
  @Prop({ mutable: true, reflect: true }) checked = false;
  @Prop({ mutable: true, reflect: true }) disabled = false;
  @Prop() name?: string;
  /** Valor enviado no formulário quando marcado. */
  @Prop() value = "on";
  @Prop() required = false;

  @Event() luckChange!: EventEmitter<{ checked: boolean }>;

  private control?: HTMLInputElement;
  private initial = false;

  componentWillLoad() {
    this.initial = this.checked;
  }

  componentDidLoad() {
    this.sync();
  }

  @Watch("checked")
  sync() {
    setFormValue(this.internals, this.checked ? this.value : null);
    if (typeof this.internals.setValidity === "function" && this.control) {
      if (this.required && !this.checked) {
        this.internals.setValidity(
          { valueMissing: true },
          this.control.validationMessage || "Obrigatório",
          this.control,
        );
      } else this.internals.setValidity({});
    }
  }

  formResetCallback() {
    this.checked = this.initial;
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  @Method()
  async setFocus() {
    this.control?.focus();
  }

  private onChange = (e: Event) => {
    this.checked = (e.target as HTMLInputElement).checked;
    this.luckChange.emit({ checked: this.checked });
  };

  render() {
    return (
      <Host>
        <label class="check">
          <input
            ref={(el) => (this.control = el)}
            type="checkbox"
            checked={this.checked}
            disabled={this.disabled}
            required={this.required}
            onChange={this.onChange}
          />
          <span class="box" aria-hidden="true">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3.5 8.5l3 3 6-7" />
            </svg>
          </span>
          <span class="label">
            <slot>{this.label}</slot>
          </span>
        </label>
      </Host>
    );
  }
}

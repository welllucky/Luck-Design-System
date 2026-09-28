import { AttachInternals, Component, Event, type EventEmitter, Host, h, Method, Prop, Watch } from "@stencil/core";
import { setFormValue } from "../../utils/field";

/**
 * Interruptor: trilho rebaixado e polegar que estica ao pressionar.
 *
 * @slot - Rótulo (alternativa ao atributo `label`).
 */
@Component({
  tag: "luck-switch",
  styleUrl: "luck-switch.css",
  shadow: { delegatesFocus: true },
  formAssociated: true,
})
export class LuckSwitch {
  @AttachInternals() internals!: ElementInternals;

  @Prop() label?: string;
  @Prop({ mutable: true, reflect: true }) checked = false;
  @Prop({ mutable: true, reflect: true }) disabled = false;
  @Prop() name?: string;
  @Prop() value = "on";

  @Event() luckChange!: EventEmitter<{ checked: boolean }>;

  private control?: HTMLButtonElement;
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

  private toggle = () => {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.luckChange.emit({ checked: this.checked });
  };

  render() {
    return (
      <Host>
        <div class="switch">
          <button
            ref={(el) => (this.control = el)}
            id="track"
            type="button"
            role="switch"
            class="track"
            aria-checked={String(this.checked)}
            aria-labelledby="label"
            disabled={this.disabled}
            onClick={this.toggle}
          >
            <span class="thumb" />
          </button>
          <label class="label" id="label" htmlFor="track">
            <slot>{this.label}</slot>
          </label>
        </div>
      </Host>
    );
  }
}

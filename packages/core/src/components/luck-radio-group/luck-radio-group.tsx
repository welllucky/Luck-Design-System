import {
  AttachInternals,
  Component,
  Element,
  Event,
  type EventEmitter,
  Host,
  h,
  Listen,
  Prop,
  Watch,
} from "@stencil/core";
import { setFormValue } from "../../utils/field";
import { cx } from "../../utils/utils";

/**
 * Grupo de `luck-radio`. Controla a seleção, as setas do teclado e o valor no formulário.
 *
 * @slot - Os `luck-radio`.
 */
@Component({
  tag: "luck-radio-group",
  styleUrl: "luck-radio-group.css",
  shadow: true,
  formAssociated: true,
})
export class LuckRadioGroup {
  @Element() el!: HTMLLuckRadioGroupElement;
  @AttachInternals() internals!: ElementInternals;

  /** Legenda do grupo. */
  @Prop() label?: string;
  @Prop({ mutable: true }) value = "";
  @Prop() name?: string;
  @Prop({ mutable: true, reflect: true }) disabled = false;
  @Prop() required = false;
  @Prop({ reflect: true }) orientation: "vertical" | "horizontal" = "vertical";

  @Event() luckChange!: EventEmitter<{ value: string }>;

  private initial = "";

  private get radios(): HTMLLuckRadioElement[] {
    return Array.from(this.el.querySelectorAll("luck-radio"));
  }

  componentWillLoad() {
    this.initial = this.value;
  }

  componentDidLoad() {
    this.sync();
  }

  @Watch("value")
  @Watch("disabled")
  sync() {
    const radios = this.radios;
    const active = radios.find((r) => r.value === this.value && !r.disabled) ?? radios.find((r) => !r.disabled);
    for (const r of radios) {
      r.checked = r.value === this.value;
      r.focusable = r === active;
      if (this.disabled) r.disabled = true;
    }
    setFormValue(this.internals, this.value || null);
    if (typeof this.internals.setValidity === "function") {
      if (this.required && !this.value) this.internals.setValidity({ valueMissing: true }, "Escolha uma opção.");
      else this.internals.setValidity({});
    }
  }

  formResetCallback() {
    this.value = this.initial;
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  private select(value: string, focus = false) {
    if (value !== this.value) {
      this.value = value;
      this.luckChange.emit({ value });
    } else this.sync();
    if (focus) this.radios.find((r) => r.value === value)?.setFocus();
  }

  @Listen("luckRadioSelect")
  onRadioSelect(e: CustomEvent<{ value: string }>) {
    e.stopPropagation();
    this.select(e.detail.value);
  }

  @Listen("keydown")
  onKeyDown(e: KeyboardEvent) {
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"];
    if (!keys.includes(e.key)) return;
    const enabled = this.radios.filter((r) => !r.disabled);
    if (!enabled.length) return;
    e.preventDefault();
    const i = Math.max(
      0,
      enabled.findIndex((r) => r.value === this.value),
    );
    const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
    this.select(enabled[(i + step + enabled.length) % enabled.length].value, true);
  }

  render() {
    return (
      <Host role="radiogroup" aria-label={this.label} aria-disabled={this.disabled ? "true" : undefined}>
        {this.label && (
          <span class="legend" aria-hidden="true">
            {this.label}
          </span>
        )}
        <div class={cx("options", `options--${this.orientation}`)}>
          <slot onSlotchange={() => this.sync()} />
        </div>
      </Host>
    );
  }
}

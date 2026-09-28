import {
  AttachInternals,
  Component,
  Element,
  Event,
  type EventEmitter,
  Host,
  h,
  Method,
  Prop,
  State,
  Watch,
} from "@stencil/core";
import { setFormValue, syncValidity } from "../../utils/field";
import { childrenByTag, cx, parseList } from "../../utils/utils";

/** Valor de uma <option> pela especificação HTML: atributo `value` ou, sem ele, o texto. */
const optionValue = (o: Element) => o.getAttribute("value") ?? o.textContent?.trim() ?? "";

export type SelectOption = string | { value: string; label: string; disabled?: boolean };

/**
 * Seleção nativa no poço rebaixado, com rótulo fixo e chevron que gira no foco.
 * Opções via `options` (array ou JSON) ou `<option>` filhos.
 *
 * @part control - O `<select>` interno.
 */
@Component({
  tag: "luck-select",
  styleUrl: "luck-select.css",
  shadow: { delegatesFocus: true },
  formAssociated: true,
})
export class LuckSelect {
  @Element() el!: HTMLLuckSelectElement;
  @AttachInternals() internals!: ElementInternals;

  @Prop() label!: string;
  /** `["A","B"]` ou `[{ value, label, disabled? }]`. Também aceita JSON no atributo. */
  @Prop() options: SelectOption[] | string = [];
  @Prop({ mutable: true }) value = "";
  /** Opção vazia e desabilitada mostrada enquanto nada foi escolhido. */
  @Prop() placeholder?: string;
  @Prop() name?: string;
  @Prop() icon?: string;
  @Prop() hint?: string;
  @Prop() error?: string;
  @Prop({ reflect: true }) disabled = false;
  @Prop() required = false;

  /** Emitido quando o usuário escolhe uma opção. */
  @Event() luckChange!: EventEmitter<{ value: string }>;
  @Event() luckFocus!: EventEmitter<void>;
  @Event() luckBlur!: EventEmitter<void>;

  @State() slotted: SelectOption[] = [];

  private control?: HTMLSelectElement;
  private initial = "";

  componentWillLoad() {
    this.readSlotted();
    // <option selected> filho define o valor inicial quando `value` não foi passado.
    if (!this.value) {
      const selected = childrenByTag<HTMLOptionElement>(this.el, "option").find((o) => o.hasAttribute("selected"));
      if (selected) this.value = optionValue(selected);
    }
    this.initial = this.value;
  }

  componentDidLoad() {
    this.syncForm();
  }

  private readSlotted() {
    this.slotted = childrenByTag<HTMLOptionElement>(this.el, "option").map((o) => ({
      value: optionValue(o),
      label: o.textContent ?? "",
      disabled: o.hasAttribute("disabled"),
    }));
  }

  @Watch("value")
  @Watch("error")
  syncForm() {
    setFormValue(this.internals, this.value);
    syncValidity(this.internals, this.control, this.error);
  }

  formResetCallback() {
    this.value = this.initial;
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  @Method()
  async setFocus() {
    this.control?.focus();
  }

  private onChange = (e: Event) => {
    this.value = (e.target as HTMLSelectElement).value;
    this.luckChange.emit({ value: this.value });
  };

  render() {
    const opts = [...parseList<SelectOption>(this.options), ...this.slotted].map((o) =>
      typeof o === "string" ? { value: o, label: o, disabled: false } : o,
    );
    const msg = this.error || this.hint;
    return (
      <Host>
        <div class={cx("field", "is-floating", this.error && "is-error", this.icon && "has-icon", msg && "has-msg")}>
          <div class="box">
            {this.icon && <luck-icon class="icon" name={this.icon} size={16} />}
            <select
              ref={(el) => (this.control = el)}
              part="control"
              id="control"
              class="control"
              name={this.name}
              disabled={this.disabled}
              required={this.required}
              aria-invalid={this.error ? "true" : undefined}
              aria-describedby={msg ? "msg" : undefined}
              onChange={this.onChange}
              onFocus={() => this.luckFocus.emit()}
              onBlur={() => this.luckBlur.emit()}
            >
              {this.placeholder && (
                <option value="" disabled selected={!this.value}>
                  {this.placeholder}
                </option>
              )}
              {opts.map((o) => (
                <option value={o.value} disabled={o.disabled} selected={o.value === this.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <label htmlFor="control" class="label">
              {this.label}
            </label>
            <luck-icon class="chevron" name="chevron-down" size={16} />
          </div>
          <div class="msg" id="msg" aria-live="polite">
            <span>
              {this.error && <luck-icon name="circle-alert" size={14} />}
              {msg}
            </span>
          </div>
        </div>
        <slot onSlotchange={() => this.readSlotted()} />
      </Host>
    );
  }
}

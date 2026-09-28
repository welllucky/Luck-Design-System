import {
  AttachInternals,
  Component,
  Event,
  type EventEmitter,
  Host,
  h,
  Method,
  Prop,
  State,
  Watch,
} from "@stencil/core";
import { check, setFormValue, shake, syncValidity, type Validator } from "../../utils/field";
import { cx } from "../../utils/utils";

/**
 * Campo de texto rebaixado (poço) com rótulo flutuante. Com `validator`, mostra ✓ quando válido e
 * balança com a mensagem de erro ao perder o foco. Participa de `<form>` nativo.
 *
 * @part control - O `<input>` interno.
 */
@Component({
  tag: "luck-input",
  styleUrls: ["../../styles/field.css", "luck-input.css"],
  shadow: { delegatesFocus: true },
  formAssociated: true,
})
export class LuckInput {
  @AttachInternals() internals!: ElementInternals;

  /** Rótulo visível (flutua ao focar ou preencher). */
  @Prop() label!: string;
  @Prop() type: "text" | "email" | "password" | "search" | "tel" | "url" | "number" | "date" = "text";
  @Prop({ mutable: true }) value = "";
  @Prop() name?: string;
  /** Ícone Lucide à esquerda. */
  @Prop() icon?: string;
  /** Texto de ajuda abaixo do campo. */
  @Prop() hint?: string;
  /** Erro controlado de fora. Tem prioridade sobre o `validator`. */
  @Prop() error?: string;
  /** Força o estado válido (✓). */
  @Prop() valid?: boolean;
  /** Função de validação: `true` válido, string com a mensagem de erro. */
  @Prop() validator?: Validator;
  @Prop({ mutable: true, reflect: true }) disabled = false;
  @Prop() required = false;
  @Prop() readonly = false;
  @Prop() autocomplete?: string;
  @Prop() inputmode?: string;
  @Prop() minlength?: number;
  @Prop() maxlength?: number;
  @Prop() min?: string;
  @Prop() max?: string;
  @Prop() step?: string;
  @Prop() pattern?: string;

  /** A cada tecla. */
  @Event() luckInput!: EventEmitter<{ value: string }>;
  /** Ao confirmar a mudança (perda de foco com valor alterado). */
  @Event() luckChange!: EventEmitter<{ value: string }>;
  @Event() luckFocus!: EventEmitter<void>;
  @Event() luckBlur!: EventEmitter<void>;

  @State() checkedValid = false;
  @State() checkedError?: string;

  private control?: HTMLInputElement;
  private box?: HTMLElement;
  private initial = "";

  componentWillLoad() {
    this.initial = this.value;
  }

  componentDidLoad() {
    this.sync();
  }

  @Watch("value")
  @Watch("error")
  sync() {
    setFormValue(this.internals, this.value);
    syncValidity(this.internals, this.control, this.error ?? this.checkedError);
  }

  formResetCallback() {
    this.value = this.initial;
    this.checkedError = undefined;
    this.checkedValid = false;
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  @Method()
  async setFocus() {
    this.control?.focus();
  }

  private onInput = (e: Event) => {
    this.value = (e.target as HTMLInputElement).value;
    if (this.validator) {
      this.checkedValid = check(this.validator, this.value).valid;
      this.checkedError = undefined;
    }
    this.luckInput.emit({ value: this.value });
  };

  private onBlur = () => {
    this.luckBlur.emit();
    if (!this.value) return;
    const error = this.validator
      ? check(this.validator, this.value).error
      : this.control && !this.control.checkValidity()
        ? this.control.validationMessage
        : undefined;
    if (error) {
      this.checkedError = error;
      this.checkedValid = false;
      shake(this.box);
    }
    this.sync();
  };

  render() {
    const err = this.error ?? this.checkedError;
    const isValid = this.valid ?? this.checkedValid;
    const msg = err || this.hint;
    return (
      <Host>
        <div class={cx("field", err && "is-error", isValid && "is-valid", this.icon && "has-icon", msg && "has-msg")}>
          <div class="box" ref={(el) => (this.box = el)}>
            {this.icon && <luck-icon class="icon" name={this.icon} size={16} />}
            <input
              ref={(el) => (this.control = el)}
              id="control"
              part="control"
              class="control"
              type={this.type}
              name={this.name}
              value={this.value}
              placeholder=" "
              disabled={this.disabled}
              required={this.required}
              readOnly={this.readonly}
              autoComplete={this.autocomplete}
              inputMode={this.inputmode}
              minLength={this.minlength}
              maxLength={this.maxlength}
              min={this.min}
              max={this.max}
              step={this.step}
              pattern={this.pattern}
              aria-invalid={err ? "true" : undefined}
              aria-describedby={msg ? "msg" : undefined}
              onInput={this.onInput}
              onChange={() => this.luckChange.emit({ value: this.value })}
              onFocus={() => this.luckFocus.emit()}
              onBlur={this.onBlur}
            />
            <label htmlFor="control" class="label">
              {this.label}
            </label>
            <span class="valid" aria-hidden="true">
              <luck-icon name="circle-check" size={16} />
            </span>
          </div>
          <div class="msg" id="msg">
            <span>
              {err && <luck-icon name="circle-alert" size={14} />}
              {msg}
            </span>
          </div>
        </div>
      </Host>
    );
  }
}

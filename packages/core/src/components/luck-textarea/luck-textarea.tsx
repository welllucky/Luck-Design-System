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
 * Área de texto rebaixada com rótulo flutuante e validação igual à do `luck-input`.
 *
 * @part control - O `<textarea>` interno.
 */
@Component({
  tag: "luck-textarea",
  styleUrls: ["../../styles/field.css", "luck-textarea.css"],
  shadow: { delegatesFocus: true },
  formAssociated: true,
})
export class LuckTextarea {
  @AttachInternals() internals!: ElementInternals;

  @Prop() label!: string;
  @Prop({ mutable: true }) value = "";
  @Prop() name?: string;
  @Prop() rows = 4;
  @Prop() hint?: string;
  @Prop() error?: string;
  @Prop() valid?: boolean;
  /** Função de validação: `true` válido, string com a mensagem de erro. */
  @Prop() validator?: Validator;
  @Prop({ mutable: true, reflect: true }) disabled = false;
  @Prop() required = false;
  @Prop() readonly = false;
  @Prop() minlength?: number;
  @Prop() maxlength?: number;

  @Event() luckInput!: EventEmitter<{ value: string }>;
  @Event() luckChange!: EventEmitter<{ value: string }>;
  @Event() luckFocus!: EventEmitter<void>;
  @Event() luckBlur!: EventEmitter<void>;

  @State() checkedValid = false;
  @State() checkedError?: string;

  private control?: HTMLTextAreaElement;
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
    this.value = (e.target as HTMLTextAreaElement).value;
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
        <div class={cx("field", "field--textarea", err && "is-error", isValid && "is-valid", msg && "has-msg")}>
          <div class="box" ref={(el) => (this.box = el)}>
            <textarea
              ref={(el) => (this.control = el)}
              id="control"
              part="control"
              class="control"
              name={this.name}
              rows={this.rows}
              value={this.value}
              placeholder=" "
              disabled={this.disabled}
              required={this.required}
              readOnly={this.readonly}
              minLength={this.minlength}
              maxLength={this.maxlength}
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

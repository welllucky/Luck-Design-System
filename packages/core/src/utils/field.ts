/** Retorno de validação: `true` é válido; string é a mensagem de erro; `false` usa a mensagem padrão. */
export type Validator = (value: string) => true | false | string;

export const DEFAULT_ERROR = "Confira este campo.";

export function check(validator: Validator | undefined, value: string): { valid: boolean; error?: string } {
  if (!validator) return { valid: false };
  const r = validator(value);
  if (r === true) return { valid: true };
  return { valid: false, error: typeof r === "string" ? r : DEFAULT_ERROR };
}

/** Reinicia a animação de "balançar" do campo. */
export function shake(el: HTMLElement | undefined) {
  if (!el) return;
  el.classList.remove("is-shaking");
  void el.offsetWidth;
  el.classList.add("is-shaking");
}

/** Espelha a validade no ElementInternals para que o `<form>` enxergue o campo. */
export function syncValidity(
  internals: ElementInternals,
  control: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | undefined,
  error: string | undefined,
) {
  if (!control || typeof internals.setValidity !== "function") return;
  try {
    if (error) internals.setValidity({ customError: true }, error, control);
    else if (!control.validity.valid) internals.setValidity(control.validity, control.validationMessage, control);
    else internals.setValidity({});
  } catch {
    // Ambientes sem suporte completo a ElementInternals (testes, navegadores antigos).
  }
}

/** `setFormValue` guardado: ambientes sem ElementInternals completo (SSR, testes) simplesmente ignoram. */
export function setFormValue(internals: ElementInternals | undefined, value: string | null) {
  if (typeof internals?.setFormValue === "function") internals.setFormValue(value);
}

import { BooleanValueAccessor } from "./generated/boolean-value-accessor";
import { DIRECTIVES } from "./generated/directives";
import { SelectValueAccessor } from "./generated/select-value-accessor";
import { TextValueAccessor } from "./generated/text-value-accessor";

/** Todos os componentes standalone: `imports: [LUCK_COMPONENTS]`. */
export const LUCK_COMPONENTS = DIRECTIVES;

/** Integração com `ngModel` e `formControl` para input, textarea, select, radio-group, checkbox e switch. */
export const LUCK_FORMS = [BooleanValueAccessor, SelectValueAccessor, TextValueAccessor] as const;

import { BooleanValueAccessor } from "./generated/boolean-value-accessor";
import * as C from "./generated/components";
import { SelectValueAccessor } from "./generated/select-value-accessor";
import { TextValueAccessor } from "./generated/text-value-accessor";

/** Todos os componentes standalone, para `imports: [...LUCK_COMPONENTS]`. */
export const LUCK_COMPONENTS = [
  C.LuckAvatar,
  C.LuckBadge,
  C.LuckButton,
  C.LuckCard,
  C.LuckCheckbox,
  C.LuckDialog,
  C.LuckIcon,
  C.LuckIconButton,
  C.LuckInput,
  C.LuckLogo,
  C.LuckNavbar,
  C.LuckProjectCard,
  C.LuckRadio,
  C.LuckRadioGroup,
  C.LuckSelect,
  C.LuckSkillList,
  C.LuckSocialLinks,
  C.LuckSwitch,
  C.LuckTab,
  C.LuckTabs,
  C.LuckTag,
  C.LuckTextarea,
  C.LuckTimeline,
  C.LuckToast,
  C.LuckTooltip,
] as const;

/** Adaptadores de formulário (ngModel / formControl) para input, textarea, select, radio-group, checkbox e switch. */
export const LUCK_FORMS = [TextValueAccessor, SelectValueAccessor, BooleanValueAccessor] as const;

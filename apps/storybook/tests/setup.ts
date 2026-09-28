import "@luck/styles/global.css";
import * as luck from "@luck/core/components";

for (const [name, define] of Object.entries(luck)) {
  if (name.startsWith("defineCustomElement") && typeof define === "function") (define as () => void)();
}

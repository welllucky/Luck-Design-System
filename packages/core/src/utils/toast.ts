import type { Components } from "../components";

export type ToastOptions = Partial<
  Pick<Components.LuckToast, "heading" | "description" | "icon" | "tone" | "duration">
>;

const REGION_ID = "luck-toast-region";

function region(): HTMLElement {
  let el = document.getElementById(REGION_ID);
  if (!el) {
    el = document.createElement("div");
    el.id = REGION_ID;
    el.setAttribute("aria-live", "polite");
    Object.assign(el.style, {
      position: "fixed",
      right: "16px",
      bottom: "16px",
      zIndex: "200",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: "10px",
      width: "min(380px, calc(100vw - 32px))",
    });
    document.body.appendChild(el);
  }
  return el;
}

/**
 * Mostra um `<luck-toast>` no canto inferior direito e o remove ao fechar.
 * `showToast({ heading: "E-mail copiado" })`
 */
export function showToast(options: ToastOptions): HTMLLuckToastElement {
  const toast = document.createElement("luck-toast");
  Object.assign(toast, options);
  toast.addEventListener("luckClose", () => toast.remove(), { once: true });
  region().appendChild(toast);
  return toast;
}

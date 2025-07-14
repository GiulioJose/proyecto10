import { createEl } from "../utils/createElements";

// Muestra el loading
export const showLoading = () => {
  // Evita múltiples spinners si ya hay uno activo
  if (document.querySelector('.loading-overlay')) return;

  const overlay = createEl("div", "loading-overlay");
  const spinner = createEl("div", "spinner");
  overlay.appendChild(spinner);
  document.body.appendChild(overlay);
};

// Oculta el loading
export const hideLoading = () => {
  setTimeout(() => {
    const overlay = document.querySelector(".loading-overlay");
    if (overlay) overlay.remove();
  }, 200); // Delay para hacerlo visible brevemente
};

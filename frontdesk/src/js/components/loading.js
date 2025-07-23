import { createEl } from "../utils/createElements.js";

// Muestra el loading
export const showLoading = () => {
  if (document.querySelector('.loading-overlay')) return;

  const overlay = createEl("div", "loading-overlay");
  const spinner = createEl("div", "spinner");
  overlay.appendChild(spinner);

  const main = document.querySelector('main');
  main.appendChild(overlay);
};

// Oculta el loading
export const hideLoading = () => {
  setTimeout(() => {
    const overlay = document.querySelector(".loading-overlay");
    if (overlay) overlay.remove();
  }, 200);
};

// Loading automático alrededor de funciones de vista
export const withLoading = (viewFn) => {
  return async function wrappedView(...args) {
    showLoading();
    try {
      const result = await viewFn(...args);
      return result;
    } finally {
      hideLoading();
    }
  };
};

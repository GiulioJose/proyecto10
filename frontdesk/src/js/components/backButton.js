import { createEl } from '../utils/createElements.js';
import { getPreviousView } from '../router/router.js';

export function createBackButton() {
  const backButton = createEl('button', 'back-btn', '← Volver');
  backButton.addEventListener('click', () => {
    const previous = getPreviousView();
    location.hash = `#${previous}`;
  });
  return backButton;
}

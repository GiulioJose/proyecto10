import { createEl } from '../utils/createElements.js';

export default function viewFavoritos() {
  const container = createEl('div', 'view');
  const title = createEl('h2', null, 'Vista de Favoritos');
  container.appendChild(title);
  return container;
}
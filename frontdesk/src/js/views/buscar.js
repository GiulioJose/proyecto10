import { createEl } from '../utils/createElements.js';

export default function viewBuscar() {
  const container = createEl('div', 'view');
  const title = createEl('h2', null, 'Vista Buscar');
  container.appendChild(title);
  return container;
}
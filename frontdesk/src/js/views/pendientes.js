import { createEl } from '../utils/createElements.js';

export default function viewPendientes() {
  const container = createEl('div', 'view');
  const title = createEl('h2', null, 'Vista de Pendientes');
  container.appendChild(title);
  return container;
}
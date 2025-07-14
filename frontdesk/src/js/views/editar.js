import { createEl } from '../utils/createElements.js';

export default function viewEditar() {
  const container = createEl('div', 'view');
  const title = createEl('h2', null, 'Vista para Editar');
  container.appendChild(title);
  return container;
}
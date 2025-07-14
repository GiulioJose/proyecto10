import { createEl } from '../utils/createElements.js';

export default function viewUsuarios() {
  const container = createEl('div', 'view');
  const title = createEl('h2', null, 'Vista de Usuarios');
  container.appendChild(title);
  return container;
}

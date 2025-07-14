import { createEl } from '../utils/createElements.js';

export default function viewInfo() {
  const container = createEl('div', 'view');
  const title = createEl('h2', null, 'Vista Informacion');
  container.appendChild(title);
  return container;
}
import { createEl } from '../utils/createElements.js';

export default function viewSubir() {
  const container = createEl('div', 'view');
  const title = createEl('h2', null, 'Vista para cargas');
  container.appendChild(title);
  return container;
}
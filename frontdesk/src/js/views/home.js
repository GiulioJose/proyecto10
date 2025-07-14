import { createEl } from '../utils/createElements.js';

export default function viewHome() {
  const container = createEl('div', 'view');
  const title = createEl('h2', null, 'Vista Home');
  container.appendChild(title);
  return container;
}

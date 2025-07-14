import { createEl } from '../utils/createElements.js';

export default function viewHome() {
  const container = createEl('div', 'view');

  const title = createEl('h2', null, 'Vista Home');

  const sessionStatus = createEl('p');
  const token = sessionStorage.getItem('token');

  sessionStatus.textContent = token ? '✅ Hay sesión activa' : '🔒 No hay sesión';

  container.append(title, sessionStatus);
  return container;
}

import { createEl } from '../utils/createElements';

export default function viewMisObras() {
  const container = createEl('div', 'mis-obras');
  const title = createEl('h2', null, 'Mis Obras');
  const text = createEl('p', null, 'Aquí se mostrarán tus obras subidas.');

  container.append(title, text);
  return container;
}

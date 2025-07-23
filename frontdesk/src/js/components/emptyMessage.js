import { createEl } from '../utils/createElements.js';

export function createEmptyMessage(texto) {
  const contenedor = createEl('div', 'empty-message');
  const mensaje = createEl('p', null, texto);
  contenedor.appendChild(mensaje);
  return contenedor;
}

export function createEmptyIconMessage(texto, icono = '📭') {
  const contenedor = createEl('div', 'empty-message');
  const icon = createEl('div', 'empty-icon', icono);
  const mensaje = createEl('p', null, texto);
  contenedor.append(icon, mensaje);
  return contenedor;
}

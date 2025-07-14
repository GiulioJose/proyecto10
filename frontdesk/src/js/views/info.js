import { createEl } from '../utils/createElements.js';

export default function viewInfo() {
  const obraData = sessionStorage.getItem('obra');

  // Validación por si no hay obra guardada
  if (!obraData) {
    const fallback = createEl('div', 'view');
    fallback.textContent = 'No se encontró información sobre la obra.';
    return fallback;
  }

  const obra = JSON.parse(obraData);
  const container = createEl('div');
  container.classList.add('view', 'info-view');

  // Imagen
  const img = createEl('img');
  img.src = obra.imagen;
  img.alt = obra.titulo;

  // Título
  const title = createEl('h2', null, obra.titulo);

  // Autor y año
  const autor = createEl('p', null, `Autor: ${obra.autor}`);
  const año = createEl('p', null, `Año: ${obra.año}`);

  // Corriente
  const corriente = createEl('p', null, `Corriente: ${obra.corriente}`);

  // País y continente
  const ubicacion = createEl('p', null, `Origen: ${obra.pais} (${obra.continente})`);

  container.append(img, title, autor, año, corriente, ubicacion);
  return container;
}

import { createEl } from '../utils/createElements.js';
import { createInfoActions } from '../components/infoActions.js';
import { showLoading, hideLoading } from '../components/loading.js';
import { getPreviousView } from '../router/router.js';

export default function viewInfo() {
  showLoading();

  const obraData = sessionStorage.getItem('obra');

  if (!obraData) {
    const fallback = createEl('div', 'view');
    fallback.textContent = 'No se encontró información sobre la obra.';
    hideLoading();
    return fallback;
  }

  const obra = JSON.parse(obraData);
  const container = createEl('div');
  container.classList.add('view', 'info-view');

  // Botón volver
  const backButton = createEl('button', 'back-btn', '← Volver');
  backButton.addEventListener('click', () => {
    const pre = sessionStorage.getItem('preInfoView');
    if (pre) {
      sessionStorage.removeItem('preInfoView');
      location.hash = `#${pre}`;
    } else {
      location.hash = `#${getPreviousView()}`;
    }
  });
  container.appendChild(backButton);

  // Contenido principal
  const contentRow = createEl('div', 'info-content');

  const figure = createEl('figure', 'info-image');
  const img = createEl('img');
  img.src = obra.imagen;
  img.alt = obra.titulo;
  figure.appendChild(img);

  const details = createEl('div', 'info-details');
  const title = createEl('h2', null, obra.titulo);
  const autor = createEl('p', null, `Autor: ${obra.autor}`);
  const año = createEl('p', null, `Año: ${obra.año}`);
  const corriente = createEl('p', null, `Corriente: ${obra.corriente}`);
  const ubicacion = createEl('p', null, `Origen: ${obra.pais} (${obra.continente})`);
  details.append(title, autor, año, corriente, ubicacion);

  contentRow.append(figure, details);

  const actionsRow = createInfoActions(obra);
  container.append(contentRow, actionsRow);

  hideLoading();
  return container;
}

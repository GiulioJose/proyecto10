import { createEl } from '../utils/createElements.js';
import { apiFetch } from '../utils/apiFetch.js';
import { renderGallery } from '../components/gallery.js';
import { withLoading } from '../components/loading.js'; // ← mismo archivo

async function viewHome() {
  const container = createEl('div', 'view');
  const galleryWrapper = createEl('div', 'gallery-wrapper');
  container.appendChild(galleryWrapper);

  try {
    const data = await apiFetch('/obras');
    renderGallery(data, galleryWrapper);
  } catch (error) {
    galleryWrapper.textContent = 'Error al cargar obras: ' + error.message;
  }

  return container;
}

export default withLoading(viewHome);

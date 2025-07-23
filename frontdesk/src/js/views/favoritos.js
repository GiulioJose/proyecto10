import { createEl } from '../utils/createElements.js';
import { apiFetch } from '../utils/apiFetch.js';
import { renderGallery } from '../components/gallery.js';
import { withLoading } from '../components/loading.js';
import { createEmptyMessage, createEmptyIconMessage } from '../components/emptyMessage.js';


async function viewFavoritos() {
  const container = createEl('div', 'view');
  const galleryWrapper = createEl('div', 'gallery-wrapper');
  container.appendChild(galleryWrapper);

  const token = sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');

  if (!token || !userId) {
    galleryWrapper.textContent = 'Debes iniciar sesión para ver tus obras favoritas.';
    return container;
  }

  try {
    const data = await apiFetch('/obras');
    const obrasFavoritas = data.obras.filter(obra =>
      obra.favoritos.map(String).includes(userId)
    );

    if (obrasFavoritas.length === 0) {
      const mensaje = createEmptyIconMessage(
        'Aún no has marcado ninguna obra como favorita.',
        '💔'
      );
      galleryWrapper.appendChild(mensaje);
    } else {
      renderGallery({ obras: obrasFavoritas }, galleryWrapper);
    }

  } catch (error) {
    galleryWrapper.textContent = 'Error al cargar tus favoritos: ' + error.message;
  }

  return container;
}

export default withLoading(viewFavoritos);

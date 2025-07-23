import { createEl } from '../utils/createElements.js';
import { apiFetch } from '../utils/apiFetch.js';
import { renderGallery } from '../components/gallery.js';
import { withLoading } from '../components/loading.js';
import { createEmptyIconMessage } from '../components/emptyMessage.js';

async function viewMisObras() {
  const container = createEl('div', 'view');
  const galleryWrapper = createEl('div', 'gallery-wrapper');
  container.appendChild(galleryWrapper);

  const token = sessionStorage.getItem('token');
  if (!token) {
    galleryWrapper.textContent = 'Debes iniciar sesión para ver tus obras.';
    return container;
  }

  try {
    const [aprobadasRes, pendientesRes] = await Promise.all([
      apiFetch('/obras/mias/aprobadas'),
      apiFetch('/obras/mias/pendientes'),
    ]);

    const obrasAprobadas = aprobadasRes.obras;
    const obrasPendientes = pendientesRes.obras;

    let tieneContenido = false;

    if (obrasPendientes.length > 0) {
      const seccion = createEl('section', 'galeria-seccion');
      const titulo = createEl('h2', null, '⏳ Obras pendientes');
      seccion.appendChild(titulo);
      renderGallery({ obras: obrasPendientes }, seccion, { mostrarFavoritos: false });
      galleryWrapper.appendChild(seccion);
      tieneContenido = true;
    }
    
    if (obrasAprobadas.length > 0) {
      const seccion = createEl('section', 'galeria-seccion');
      const titulo = createEl('h2', null, '📌 Obras aprobadas');
      seccion.appendChild(titulo);
      renderGallery({ obras: obrasAprobadas }, seccion);
      galleryWrapper.appendChild(seccion);
      tieneContenido = true;
    }

    if (!tieneContenido) {
      const mensaje = createEmptyIconMessage(
        'Aún no has subido obras a la galería.',
        '🖼️'
      );
      galleryWrapper.appendChild(mensaje);
    }

  } catch (error) {
    galleryWrapper.textContent = 'Error al cargar tus obras: ' + error.message;
  }

  return container;
}

export default withLoading(viewMisObras);

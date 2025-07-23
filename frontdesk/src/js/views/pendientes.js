import { createEl } from '../utils/createElements.js';
import { apiFetch } from '../utils/apiFetch.js';
import { renderGallery } from '../components/gallery.js';
import { withLoading } from '../components/loading.js';
import { createEmptyIconMessage } from '../components/emptyMessage.js';


async function viewPendientes() {
  const container = createEl('div', 'view');
  const galleryWrapper = createEl('div', 'gallery-wrapper');
  container.appendChild(galleryWrapper);

  const role = sessionStorage.getItem('role');
  if (role !== 'admin') {
    galleryWrapper.textContent = 'Acceso no autorizado.';
    return container;
  }

  try {
    const data = await apiFetch('/obras/pendientes');
    if (data.obras.length === 0) {
      const mensaje = createEmptyIconMessage('No hay obras pendientes por aprobar.', '✅');
      galleryWrapper.appendChild(mensaje);
    } else {
      renderGallery(data, galleryWrapper, { mostrarFavoritos: false });
    }
    
  } catch (error) {
    galleryWrapper.textContent = 'Error al cargar obras pendientes: ' + error.message;
  }

  return container;
}

export default withLoading(viewPendientes);

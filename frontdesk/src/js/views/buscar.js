import { createEl } from '../utils/createElements.js';
import { apiFetch } from '../utils/apiFetch.js';
import { renderGallery } from '../components/gallery.js';
import { initBuscador } from '../components/buscador.js';
import { withLoading } from '../components/loading.js';

async function viewBuscar() {
  const section = createEl('section');
  section.id = 'buscar';

  const barraBusqueda = createEl('div', 'barra-busqueda');
  const input = createEl('input', 'buscador');
  input.type = 'text';
  input.placeholder = ' Buscar obras...';
  barraBusqueda.appendChild(input);

  const galleryWrapper = createEl('div', 'gallery-wrapper');

  section.appendChild(barraBusqueda);
  section.appendChild(galleryWrapper);

  try {
    const obrasRespuesta = await apiFetch('/obras');

    // ✅ renderGallery recibe el objeto completo
    renderGallery(obrasRespuesta, galleryWrapper);

    // ✅ initBuscador recibe solo el array de obras
    initBuscador(input, galleryWrapper, obrasRespuesta.obras);
  } catch (error) {
    galleryWrapper.textContent = 'Error al cargar obras: ' + error.message;
  }

  return section;
}

export default withLoading(viewBuscar);

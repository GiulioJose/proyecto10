import { createEl } from '../utils/createElements.js';
import { apiFetch } from '../utils/apiFetch.js';
import { showLoading, hideLoading } from './loading.js';
import { getPreviousView } from '../router/router.js';

export function createInfoActions(obra) {
  const contenedor = createEl('div', 'info-actions');

  const role = sessionStorage.getItem('role');
  const userId = sessionStorage.getItem('userId');
  const esAutor = obra.subidaPor === userId;
  const puedeModificar = (role === 'admin') || (role === 'user' && esAutor && !obra.aprobada);

  // Descargar
  const descargarBtn = createEl('button', ['info-action-btn', 'is-info'], 'Descargar');
  descargarBtn.addEventListener('click', async () => {
    try {
      const nombre = obra.titulo
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase();

      const response = await fetch(obra.imagen);
      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${nombre}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Error al descargar la imagen:', err);
      alert('No se pudo descargar la imagen.');
    }
  });
  contenedor.appendChild(descargarBtn);

  // Aprobar (solo admin)
  if (role === 'admin' && !obra.aprobada) {
    const aprobarBtn = createEl('button', ['info-action-btn', 'is-success'], 'Aprobar');
    aprobarBtn.addEventListener('click', async () => {
      try {
        const res = await apiFetch(`/obras/${obra._id}/aprobar`, { method: 'PATCH' });
        alert(res.message || 'Obra aprobada.');
        obra.aprobada = true;
        sessionStorage.setItem('obra', JSON.stringify(obra));
        location.reload();
      } catch (err) {
        console.error('Error al aprobar la obra:', err);
        alert('Error al aprobar obra.');
      }
    });
    contenedor.appendChild(aprobarBtn);
  }

  // Editar / Eliminar
  if (puedeModificar) {
    const editarBtn = createEl('button', ['info-action-btn', 'is-warning'], 'Editar');
    editarBtn.addEventListener('click', () => {
      sessionStorage.setItem('obraEditar', JSON.stringify(obra));
      sessionStorage.setItem('preInfoView', getPreviousView());
      location.hash = '#editar';
    });
    contenedor.appendChild(editarBtn);

    const eliminarBtn = createEl('button', ['info-action-btn', 'is-error'], 'Eliminar');
    eliminarBtn.addEventListener('click', async () => {
      if (!confirm('¿Estás seguro de que querés eliminar esta obra?')) return;

      try {
        showLoading();
        const res = await apiFetch(`/obras/${obra._id}`, { method: 'DELETE' });
        alert(res.message || 'Obra eliminada');
        location.hash = '#home';
      } catch (err) {
        console.error('Error al eliminar la obra:', err);
        alert('Error al eliminar obra');
      } finally {
        hideLoading();
      }
    });
    contenedor.appendChild(eliminarBtn);
  }

  return contenedor;
}

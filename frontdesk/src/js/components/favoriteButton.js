import { createEl } from '../utils/createElements.js';
import { apiFetch } from '../utils/apiFetch.js';

/**
 * Crea un botón funcional de favoritos para una obra
 * @param {object} obra - Obra con ._id y .favoritos (array de userIds)
 * @returns {HTMLElement} - Botón de favoritos
 */
export function createFavoriteButton(obra) {
  const userId = sessionStorage.getItem('userId');
  const btn = createEl('button', 'fav-btn');

  const isFav = () => {
    return obra.favoritos.some(id => String(id).trim() === String(userId).trim());
  };

  const updateIcon = () => {
    btn.textContent = isFav() ? '❤️' : '🤍';
  };

  updateIcon();

  btn.addEventListener('click', async () => {
    try {
      await apiFetch(`/obras/${obra._id}/favorito`, {
        method: 'PATCH',
      });

      // toggle local
      if (isFav()) {
        obra.favoritos = obra.favoritos.filter(id => String(id).trim() !== String(userId).trim());
      } else {
        obra.favoritos.push(userId);
      }

      updateIcon();
    } catch (error) {
      console.error('Error al marcar favorito:', error);
    }
  });

  return btn;
}

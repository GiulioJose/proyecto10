import Macy from 'macy';
import { createFavoriteButton } from './favoriteButton.js';

export function renderGallery(data, container, { mostrarFavoritos = true } = {}) {
  const gallery = document.createElement('div');
  gallery.classList.add('gallery');
  // ❌ No se asigna ID para evitar conflictos si hay varias galerías

  const obras = data.obras || [];
  const haySesion = !!sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');

  obras.forEach(obra => {
    obra.favoritos = obra.favoritos || [];

    const card = document.createElement('div');
    card.classList.add('art-card');

    const img = document.createElement('img');
    img.src = obra.imagen;
    img.alt = obra.titulo || 'Obra de arte';
    img.loading = 'lazy';

    const infoBtn = document.createElement('button');
    infoBtn.classList.add('info-btn');
    infoBtn.textContent = '+info';

    infoBtn.addEventListener('click', () => {
      if (!haySesion) {
        alert('Debes iniciar sesión para ver la información de la obra.');
        return;
      }

      sessionStorage.setItem('obra', JSON.stringify(obra));
      setTimeout(() => {
        location.hash = '#info';
      }, 0);
    });

    card.appendChild(img);
    card.appendChild(infoBtn);

    if (mostrarFavoritos && haySesion && userId) {
      const favBtn = createFavoriteButton(obra);
      card.appendChild(favBtn);
    }

    gallery.appendChild(card);
  });

  container.appendChild(gallery);

  setTimeout(() => {
    Macy({
      container: gallery, // ✅ Pasamos el nodo directamente
      trueOrder: false,
      waitForImages: true,
      margin: 16,
      columns: 4,
      breakAt: {
        1200: 3,
        768: 2,
        480: 1
      }
    });
  }, 0);
}

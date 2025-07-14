import Macy from 'macy';
import { createFavoriteButton } from './favoriteButton.js';

export function renderGallery(data, container) {
  console.log('🔍 renderGallery recibió:', data);

  const gallery = document.createElement('div');
  gallery.classList.add('gallery');
  gallery.id = 'gallery';

  const obras = data.obras || [];
  const haySesion = !!sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId');

  if (obras.length) {
    console.log('🖼 Primera obra:', obras[0]);
    console.log('❤️ Favoritos de la primera obra:', obras[0].favoritos);
    console.log('👤 userId actual:', userId);
  }

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
  const haySesion = !!sessionStorage.getItem('token');

  if (!haySesion) {
    alert('Debes iniciar sesión para ver la información de la obra.');
    return;
  }

  sessionStorage.setItem('obra', JSON.stringify(obra));
  location.hash = '#info';
});

    card.appendChild(img);
    card.appendChild(infoBtn);

    if (haySesion && userId) {
      const favBtn = createFavoriteButton(obra);
      card.appendChild(favBtn);
    }

    gallery.appendChild(card);
  });

  container.appendChild(gallery);

  setTimeout(() => {
    Macy({
      container: '#gallery',
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

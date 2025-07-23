import { createEl } from '../utils/createElements.js';
import { refreshHeader } from './header.js';

const createToggleMenu = () => {
  const isLoggedIn = !!sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');

  const menu = createEl('nav', 'toggleMenu');
  const ul = createEl('ul');

  const navLinks = isLoggedIn
    ? [
        { text: 'Favoritos', id: 'favoritos' },
        { text: 'Mis Obras', id: 'misobras' },
        { text: 'Subir', id: 'subir' },
        { text: 'Buscar', id: 'buscar' }
      ]
    : [];

  if (isLoggedIn && role === 'admin') {
    navLinks.push(
      { text: 'Pendientes', id: 'pendientes' },
      { text: 'Usuarios', id: 'usuarios' }
    );
  }

  const sessionLinks = isLoggedIn
    ? [{ text: 'Cerrar sesión', id: 'logout' }]
    : [
        { text: 'Ingresar', id: 'login' },
        { text: 'Registrarse', id: 'register' }
      ];

  const allLinks = [...navLinks, ...sessionLinks];

  allLinks.forEach(({ text, id }) => {
    const li = createEl('li');
    const a = createEl('a', null, text);
    a.href = `#${id}`;

    a.addEventListener('click', (e) => {
      e.preventDefault();

      if (id === 'logout') {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        refreshHeader();
      
        if (location.hash === '#home') {
          window.dispatchEvent(new HashChangeEvent('hashchange'));
        } else {
          location.hash = '#home';
        }
      } else {
        location.hash = `#${id}`;
      }

      menu.remove();
    });

    li.appendChild(a);
    ul.appendChild(li);
  });

  menu.appendChild(ul);
  return menu;
};

// Escucha al botón hamburguesa
document.addEventListener('click', (e) => {
  if (e.target.matches('.toggleButton')) {
    const existing = document.querySelector('.toggleMenu');
    if (existing) {
      existing.remove();
      return;
    }

    const menu = createToggleMenu();
    const header = e.target.closest('header');
    if (header) header.appendChild(menu);
  } else {
    // Cerrar si se hace click fuera del toggle
    const menu = document.querySelector('.toggleMenu');
    if (menu && !menu.contains(e.target)) {
      menu.remove();
    }
  }
});

// Cierra el toggle si el ancho supera 800px
window.addEventListener('resize', () => {
  if (window.innerWidth > 800) {
    document.querySelector('.toggleMenu')?.remove();
  }
});

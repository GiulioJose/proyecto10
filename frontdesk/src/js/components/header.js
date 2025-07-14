import { createEl } from '../utils/createElements.js';
import { showLoading, hideLoading } from '../components/loading.js';

export const createHeader = () => {
  const isLoggedIn = !!sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');

  const header = createEl('header', 'header');

  // Logo
  const logo = createEl('a', 'logo', 'Galería de Arte');
  logo.href = '#home';

  // Navegación principal (desktop)
  const nav = createEl('nav', 'links');
  const ul = document.createElement('ul');

  const navLinks = isLoggedIn
    ? [
        { text: 'Favoritos', href: '#favoritos' },
        { text: 'Mis Obras', href: '#misobras' },
        { text: 'Subir', href: '#subir' },
        { text: 'Buscar', href: '#buscar' }
      ]
    : [];

  if (isLoggedIn && role === 'admin') {
    navLinks.push(
      { text: 'Pendientes', href: '#pendientes' },
      { text: 'Usuarios', href: '#usuarios' }
    );
  }

  navLinks.forEach(({ text, href }) => {
    const li = document.createElement('li');
    const a = createEl('a', null, text);
    a.href = href;
    li.appendChild(a);
    ul.appendChild(li);
  });

  nav.appendChild(ul);

  // Navegación de sesión
  const session = createEl('nav', 'session');
  const sessionUl = document.createElement('ul');

  const sessionLinks = isLoggedIn
    ? [{ text: 'Cerrar sesión', id: 'logout' }]
    : [
        { text: 'Ingresar', id: 'login' },
        { text: 'Registrarse', id: 'register' }
      ];

  sessionLinks.forEach(({ text, id }) => {
    const li = document.createElement('li');
    const a = createEl('a', 'session-link', text);
    a.href = id === 'logout' ? '#' : `#${id}`;

    a.addEventListener('click', async (e) => {
      if (id === 'logout') {
        e.preventDefault();
        showLoading();

        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('userId');
        refreshHeader();

        if (location.hash === '#home') {
          window.dispatchEvent(new HashChangeEvent('hashchange'));
        } else {
          location.hash = '#home';
        }

        hideLoading();
      }
    });

    li.appendChild(a);
    sessionUl.appendChild(li);
  });

  session.appendChild(sessionUl);

  // Botón hamburguesa (solo activa toggle en mobile)
  const toggleButton = createEl('button', 'toggleButton', '☰');
  toggleButton.type = 'button';

  header.append(logo, nav, session, toggleButton);
  return header;
};

export const refreshHeader = () => {
  const oldHeader = document.querySelector('header');
  if (oldHeader) oldHeader.remove();

  const newHeader = createHeader();
  const app = document.getElementById('app');
  app.insertBefore(newHeader, app.firstChild);
};

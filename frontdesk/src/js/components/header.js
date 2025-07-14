import { createEl } from '../utils/createElements.js';

export const createHeader = () => {
  const isLoggedIn = !!sessionStorage.getItem('token');

  const header = createEl('header', 'header');

  // Logo
  const logo = createEl('a', 'logo', 'Galería de Arte');
  logo.href = '#home';

  // Navegación principal
  const nav = createEl('nav', 'links');
  const ul = document.createElement('ul');
  const links = [
    { text: 'Favoritos', href: '#favoritos' },
    { text: 'Mis Obras', href: '#usuarios' },
    { text: 'Subir', href: '#subir' },
    { text: 'Buscar', href: '#buscar' }
  ];

  links.forEach(({ text, href }) => {
    const li = document.createElement('li');
    const a = createEl('a', null, text);
    a.href = href;
    li.appendChild(a);
    ul.appendChild(li);
  });

  nav.appendChild(ul);

  // Sesión
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

    a.addEventListener('click', (e) => {
      if (id === 'logout') {
        e.preventDefault();
        sessionStorage.removeItem('token');
        location.reload(); // reinicia para volver a estado no logueado
      }
    });

    li.appendChild(a);
    sessionUl.appendChild(li);
  });

  session.appendChild(sessionUl);

  // Botón de menú hamburguesa (por ahora solo visual)
  const toggleButton = createEl('button', 'toggleButton', '☰');

  // Montaje final
  header.append(logo, nav, session, toggleButton);
  return header;
};

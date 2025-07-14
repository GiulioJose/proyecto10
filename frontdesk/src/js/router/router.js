import routes from './routes.js';
import { createHeader } from '../components/header.js';
import { createFooter } from '../components/footer.js';

const main = document.createElement('main');
const section = document.createElement('section');
main.appendChild(section);

const renderLayout = () => {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const header = createHeader();
  const footer = createFooter();

  app.appendChild(header);
  app.appendChild(main);
  app.appendChild(footer);
};

const renderRoute = async (routeName) => {
  const route = routes[routeName];
  if (route) {
    const viewContent = await route(); // función que devuelve un nodo
    section.innerHTML = '';
    section.id = routeName;
    section.appendChild(viewContent);
  } else {
    section.innerHTML = '<p>Vista no encontrada</p>';
    section.id = 'not-found';
  }
};

const initRouter = () => {
  window.addEventListener('hashchange', () => {
    const viewName = location.hash.slice(1) || 'home';
    renderRoute(viewName);
  });

  renderLayout();
  const initialView = location.hash.slice(1) || 'home';
  renderRoute(initialView);
};

export default initRouter;

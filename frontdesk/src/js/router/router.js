import routes from './routes.js';
import { createHeader } from '../components/header.js';
import { createFooter } from '../components/footer.js';

const main = document.createElement('main');
const section = document.createElement('section');
main.appendChild(section);

let currentView = 'home';
let previousView = null;

export function setPreviousView(viewName) {
  previousView = viewName;
}

export function getPreviousView() {
  return previousView || 'home';
}

const renderLayout = () => {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const header = createHeader();
  const footer = createFooter();

  app.appendChild(header);
  app.appendChild(main);
  app.appendChild(footer);
};

export const renderRoute = async (routeName) => {
  if (routeName !== currentView) {
    previousView = currentView;
    currentView = routeName;
  }

  const route = routes[routeName];
  if (route) {
    const viewContent = await route();
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

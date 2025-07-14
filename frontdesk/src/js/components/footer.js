import { createEl } from '../utils/createElements';

export const createFooter = () => {
  const footer = createEl('footer', 'footer');
  const container = createEl('div', 'footer__container');
  const textEl = createEl('p', 'footer__text');

  // Elementos de texto con misma clase
  const nameSpan = createEl('span', 'footer__name', 'Giulio ');
  const yearSpan = createEl('span', 'footer__year', String(new Date().getFullYear()));
  const loveSpan = createEl('span', 'footer__name', 'Love');
  const coffeeSpan = createEl('span', 'footer__name', 'Coffee');

  // Montaje
  textEl.append(
    document.createTextNode('Designed and built by '),
    nameSpan,
    document.createElement('br'),
    document.createTextNode('with '),
    loveSpan,
    document.createTextNode(' & '),
    coffeeSpan,
    document.createTextNode(' © '),
    yearSpan
  );

  container.appendChild(textEl);
  footer.appendChild(container);
  return footer;
};

